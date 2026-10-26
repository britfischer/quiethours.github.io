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
                src["items"].append({
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
