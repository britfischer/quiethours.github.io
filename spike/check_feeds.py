"""Feed test: can Quiet Hours pull in each source, and what comes through?

Runs on GitHub's servers (see .github/workflows/feed-spike.yml). For each source
it finds the feed, reads the newest items and records what a reader would get:
title, date, full text or only a teaser, an image, audio or video, and whether
the original article page can be fetched when the feed only has a teaser.

Writes spike/results/results.json and spike/results/results.md.
"""
import json, re, time, html, urllib.parse, urllib.request, urllib.error, pathlib
import feedparser

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 QuietHoursFeedTest/0.1")
HERE = pathlib.Path(__file__).parent
OUT = HERE / "results"


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
            return {"status": r.status, "url": r.geturl(), "body": body,
                    "type": r.headers.get("content-type", ""), "ms": int((time.time() - t) * 1000)}
    except urllib.error.HTTPError as e:
        return {"status": e.code, "url": url, "body": b"", "type": "", "ms": int((time.time() - t) * 1000)}
    except Exception as e:  # network, TLS, timeout
        return {"status": 0, "url": url, "body": b"", "type": "", "error": str(e)[:200], "ms": int((time.time() - t) * 1000)}


def text_of(b):
    return b.decode("utf-8", "replace") if isinstance(b, bytes) else (b or "")


def words(htmltext):
    t = re.sub(r"<[^>]+>", " ", htmltext or "")
    return len(html.unescape(t).split())


def advertised_feeds(page_html, base):
    found = []
    for tag in re.findall(r"<link[^>]+>", page_html, flags=re.I):
        if re.search(r'rel=["\']?alternate', tag, re.I) and re.search(r"(rss|atom)\+xml", tag, re.I):
            m = re.search(r'href=["\']([^"\']+)', tag, re.I)
            if m:
                found.append(urllib.parse.urljoin(base, html.unescape(m.group(1))))
    return found


def find_feed(src):
    """Return (feed_url, how_found, notes)."""
    url, kind = src["url"], src["kind"]
    notes = []
    if kind == "video":
        page = get(url.replace("/videos", ""))
        h = text_of(page["body"])
        m = re.search(r"feeds/videos\.xml\?channel_id=(UC[\w-]{22})", h) or re.search(r'"(?:channelId|externalId)":"(UC[\w-]{22})"', h)
        if m:
            return f"https://www.youtube.com/feeds/videos.xml?channel_id={m.group(1)}", "channel page", notes
        notes.append(f"channel page status {page['status']}, no channel ID found")
        return None, None, notes
    page = get(url)
    h = text_of(page["body"])
    if page["status"] != 200:
        notes.append(f"home page status {page['status']} {page.get('error','')}".strip())
    adv = [f for f in advertised_feeds(h, page["url"]) if "comments" not in f.lower()]
    if adv:
        return adv[0], "advertised on the page", notes
    candidates = ["feed", "feed/", "rss", "rss.xml", "feed.xml", "atom.xml", "index.xml"]
    for c in candidates:
        cu = urllib.parse.urljoin(url if url.endswith("/") else url + "/", c)
        r = get(cu)
        if r["status"] == 200 and re.search(r"<(rss|feed|rdf)", text_of(r["body"])[:2000], re.I):
            return cu, "common feed address", notes
    if kind == "podcast" and src.get("search"):
        q = urllib.parse.quote(src["search"])
        r = get(f"https://itunes.apple.com/search?media=podcast&entity=podcast&limit=3&term={q}")
        try:
            res = json.loads(text_of(r["body"])).get("results", [])
            if res and res[0].get("feedUrl"):
                notes.append(f"matched Apple Podcasts listing: {res[0].get('collectionName')}")
                return res[0]["feedUrl"], "Apple Podcasts directory", notes
        except Exception:
            pass
    notes.append("no feed found on the page or at common addresses")
    return None, None, notes


def first_image(e):
    for key in ("media_thumbnail", "media_content"):
        for m in e.get(key, []) or []:
            if m.get("url") and (key == "media_thumbnail" or "image" in (m.get("type") or "image") or m.get("medium") == "image"):
                return m["url"]
    for l in e.get("links", []):
        if (l.get("type") or "").startswith("image"):
            return l.get("href")
    if e.get("image") and isinstance(e["image"], dict) and e["image"].get("href"):
        return e["image"]["href"]
    body = (e.get("content") or [{}])[0].get("value", "") + (e.get("summary") or "")
    m = re.search(r'<img[^>]+src=["\']([^"\']+)', body)
    return m.group(1) if m else None


def media_of(e):
    for l in e.get("links", []):
        t = l.get("type") or ""
        if l.get("rel") == "enclosure" and (t.startswith("audio") or t.startswith("video")):
            return t
    if e.get("yt_videoid"):
        return "youtube video (plays in YouTube's embedded player)"
    return None


def check(src):
    row = {"name": src["name"], "kind": src["kind"], "url": src["url"]}
    feed_url, how, notes = find_feed(src)
    row.update({"feed_url": feed_url, "found_by": how, "notes": notes})
    if not feed_url:
        row["verdict"] = "no feed"
        return row
    r = get(feed_url)
    row["feed_status"], row["feed_ms"] = r["status"], r["ms"]
    if r["status"] != 200:
        row["verdict"] = "feed blocked"
        row["notes"].append(f"feed returned {r['status']} {r.get('error','')}".strip())
        return row
    f = feedparser.parse(r["body"])
    row["feed_title"] = f.feed.get("title")
    row["items_in_feed"] = len(f.entries)
    items = []
    for e in f.entries[:3]:
        full = (e.get("content") or [{}])[0].get("value", "")
        summ = e.get("summary") or ""
        n_full, n_summ = words(full), words(summ)
        item = {
            "title": e.get("title"),
            "published": e.get("published") or e.get("updated"),
            "link": e.get("link"),
            "words_in_feed": max(n_full, n_summ),
            "has_full_text": max(n_full, n_summ) >= 250,
            "image": bool(first_image(e)),
            "media": media_of(e),
            "paywall_hint": bool(re.search(r"paid subscribers|subscribe to read|keep reading with a 7-day", full + summ, re.I)),
        }
        items.append(item)
    row["sample"] = items
    # if the feed only carries a teaser, can the article page itself be fetched?
    if items and not any(i["has_full_text"] for i in items) and src["kind"] in ("blog", "newsletter") and items[0]["link"]:
        a = get(items[0]["link"])
        row["article_page_status"] = a["status"]
        row["article_page_words"] = words(text_of(a["body"]))
    newest = f.entries[0] if f.entries else None
    row["newest_date"] = (newest.get("published") or newest.get("updated")) if newest else None
    full_share = sum(1 for i in items if i["has_full_text"])
    if src["kind"] == "video" or src["kind"] == "podcast":
        row["verdict"] = "works" if items and all(i["media"] or i["image"] for i in items) else "partly"
    elif full_share == len(items) and items:
        row["verdict"] = "works"
    elif items and row.get("article_page_status") == 200:
        row["verdict"] = "partly: teaser in feed, full article fetchable"
    elif items:
        row["verdict"] = "partly: teaser only"
    else:
        row["verdict"] = "empty feed"
    return row


def main():
    sources = json.loads((HERE / "sources.json").read_text())
    rows = []
    for s in sources:
        try:
            rows.append(check(s))
        except Exception as ex:
            rows.append({"name": s["name"], "kind": s["kind"], "url": s["url"], "verdict": "script error", "notes": [str(ex)[:300]]})
        time.sleep(1)  # be polite to each site
    OUT.mkdir(exist_ok=True)
    (OUT / "results.json").write_text(json.dumps(rows, indent=1))
    lines = ["# Feed test results", "", f"Run on GitHub's servers, {time.strftime('%Y-%m-%d %H:%M UTC', time.gmtime())}.", "",
             "| Source | Type | Verdict | Feed found by | Items | Newest | Full text | Image | Media |",
             "|---|---|---|---|---|---|---|---|---|"]
    for r in rows:
        smp = r.get("sample") or []
        lines.append("| {} | {} | {} | {} | {} | {} | {} | {} | {} |".format(
            r["name"], r["kind"], r.get("verdict"), r.get("found_by") or "-", r.get("items_in_feed", "-"),
            (r.get("newest_date") or "-")[:16],
            f"{sum(1 for i in smp if i['has_full_text'])}/{len(smp)}" if smp else "-",
            f"{sum(1 for i in smp if i['image'])}/{len(smp)}" if smp else "-",
            next((i["media"] for i in smp if i["media"]), "-")))
    lines += ["", "## Notes", ""]
    for r in rows:
        extra = r.get("notes") or []
        if r.get("article_page_status") is not None:
            extra.append(f"article page fetch: status {r['article_page_status']}, about {r.get('article_page_words')} words of page text")
        if any(i.get("paywall_hint") for i in r.get("sample") or []):
            extra.append("at least one sampled item looks paid-only")
        lines.append(f"- **{r['name']}**: feed `{r.get('feed_url') or 'none'}`" + ("; " + "; ".join(extra) if extra else ""))
    (OUT / "results.md").write_text("\n".join(lines) + "\n")
    print("\n".join(lines))


if __name__ == "__main__":
    main()
