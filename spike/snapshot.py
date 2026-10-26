"""Snapshot of the owner's real sources, for the prototype's sample data.

Only headlines, dates, links and a one-line preview are kept: the repo and the
site are public, so full article text from other publishers is not stored here.

Reads the feeds the feed test found (results/results.json) and saves the newest
items from each as plain text: title, date, link, a short standfirst, a few
body paragraphs and a length estimate. Writes results/snapshot.json.
"""
import json, re, html, pathlib, urllib.request
import feedparser

HERE = pathlib.Path(__file__).parent
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36 QuietHoursFeedTest/0.1")
PER_SOURCE = 6


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()


def plain(h):
    h = re.sub(r"(?is)<(script|style|figure|iframe).*?</\1>", " ", h or "")
    h = re.sub(r"(?i)</p>|<br\s*/?>|</h\d>|</li>", "\n", h)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    paras = [re.sub(r"\s+", " ", p).strip() for p in t.split("\n")]
    return [p for p in paras if len(p) > 40 and not re.search(r"appeared first on|read more|continue reading", p, re.I)]


def minutes(e, kind, words):
    d = e.get("itunes_duration")
    if d:
        parts = [int(x) for x in str(d).split(":") if x.isdigit()]
        secs = parts[-1] + (parts[-2] * 60 if len(parts) > 1 else 0) + (parts[-3] * 3600 if len(parts) > 2 else 0)
        if len(parts) == 1:
            secs = parts[0]
        return max(1, round(secs / 60))
    if kind == "video":
        return None
    return max(2, round(words / 230))


def image_of(e, feed):
    for key in ("media_thumbnail", "media_content"):
        for m in e.get(key, []) or []:
            if m.get("url") and (key == "media_thumbnail" or "image" in (m.get("type") or "image") or m.get("medium") == "image"):
                return m["url"]
    for l in e.get("links", []):
        if (l.get("type") or "").startswith("image"):
            return l.get("href")
    if isinstance(e.get("image"), dict) and e["image"].get("href"):
        return e["image"]["href"]
    body = (e.get("content") or [{}])[0].get("value", "") + (e.get("summary") or "")
    m = re.search(r'<img[^>]+src=["\']([^"\']+)', body)
    if m:
        return m.group(1)
    return None


def og_image(url):
    """The share image a page declares, which is what readers use when a feed sends none."""
    try:
        h = fetch(url).decode("utf-8", "replace")[:300000]
    except Exception:
        return None
    m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]*content=["\']([^"\']+)', h, re.I) or \
        re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*property=["\']og:image', h, re.I)
    return html.unescape(m.group(1)) if m else None


def audio_of(e):
    for l in e.get("links", []):
        if l.get("rel") == "enclosure" and (l.get("type") or "").startswith("audio"):
            return l.get("href")
    return None


def main():
    rows = json.loads((HERE / "results" / "results.json").read_text())
    out = []
    for r in rows:
        src = {"name": r["name"], "kind": r["kind"], "url": r["url"], "feed_url": r.get("feed_url"),
               "verdict": r.get("verdict"), "items": []}
        if r.get("feed_url") and r.get("verdict", "").startswith(("works", "partly")):
            try:
                f = feedparser.parse(fetch(r["feed_url"]))
            except Exception as ex:
                src["error"] = str(ex)[:200]
                f = None
            for e in (f.entries[:PER_SOURCE] if f else []):
                body = plain((e.get("content") or [{}])[0].get("value", "")) or plain(e.get("summary", ""))
                if r["kind"] == "video":
                    body = plain((e.get("media_description") or e.get("summary") or "").replace("\n", "</p>"))
                words = sum(len(p.split()) for p in body)
                stand = (body[0] if body else "")
                stand = stand if len(stand) <= 180 else stand[:177].rsplit(" ", 1)[0] + "…"
                img = image_of(e, f)
                if not img and r["kind"] in ("blog", "newsletter") and e.get("link"):
                    img = og_image(e["link"])
                if not img and r["kind"] == "podcast":
                    img = (f.feed.get("image") or {}).get("href")
                src["items"].append({
                    "image": img,
                    "video_id": e.get("yt_videoid"),
                    "audio": audio_of(e),
                    "title": html.unescape(e.get("title", "")).strip(),
                    "published": e.get("published") or e.get("updated"),
                    "published_parsed": list(e.get("published_parsed") or e.get("updated_parsed") or [])[:6],
                    "link": e.get("link"),
                    "standfirst": stand,
                    "full_text": words >= 250,
                    "minutes": minutes(e, r["kind"], words),
                })
        out.append(src)
    (HERE / "results" / "snapshot.json").write_text(json.dumps(out, indent=1))
    for s in out:
        print(s["name"], len(s["items"]))


if __name__ == "__main__":
    main()
