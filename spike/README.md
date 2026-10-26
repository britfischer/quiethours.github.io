# Feed test: can Quiet Hours pull in real sources?

Run 2026-10-26 on GitHub's servers against 10 of the owner's real sources.
Raw numbers: `results/results.md` and `results/results.json`. The script is
`check_feeds.py`; it reruns whenever it or `sources.json` changes on this branch.

## Results

| Source | Type | Result | What comes through |
|---|---|---|---|
| Camille Styles | Blog | ✅ Works | Full article, images, dates |
| Cup of Jo | Blog | ⚠️ Teaser only | Teaser and image in the feed; the full article page loads fine, so the app has to fetch and clean it |
| Wit & Delight | Blog | ⚠️ Teaser only | Teaser, no image in the feed; full article page loads fine |
| Caroline Winkler | YouTube | ✅ Works | Title, thumbnail, description, date; plays in YouTube's embedded player |
| Jenn Im | YouTube | ✅ Works | Same |
| Sophia Chang | YouTube | ✅ Works | Same |
| Healthy Emmie | YouTube | ✅ Works | Same |
| Dear Gabby | Podcast | ✅ Works | Every episode (342) with the audio file and show notes. Found through the Apple Podcasts directory, not her website |
| Jenn Eats Goood | Substack | ❌ Blocked | Substack refused GitHub's servers outright (403), whatever the request said it was |
| Justine Snacks | Substack | ❌ Blocked | Same |
| Martha Stewart | Site | Not tested | Claude's tools refuse this site, so it was left out rather than tested another way |

## What it means for the build

1. **YouTube and podcasts are solved.** YouTube gives every channel a feed once
   the channel ID is found from the channel page. Podcasts should be looked up
   in the Apple Podcasts directory, because a podcast's website often advertises
   the blog feed instead (Gabby Bernstein's did).
2. **Blogs need a "full article" step.** Two of three blogs put only a teaser in
   the feed. The reader needs a step that fetches the article page and strips it
   to clean text (a readability step). Both pages loaded without trouble.
3. **Substack is the open risk.** The spec assumes `<publication>/feed` works,
   and from a cloud server it did not. Vercel is also a cloud server, so it may
   be refused the same way. Options, in order: test once from Vercel; if refused,
   receive the newsletters by email at a private address the app reads, which
   is how readers such as Feedbin and Readwise Reader take in newsletters.
4. **Images are uneven.** One blog sends no image at all, so the 16:9 frame needs
   a designed fallback rather than an empty box.
