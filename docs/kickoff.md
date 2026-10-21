# Kickoff: the interactive prototype

Goal of this stage: a **real, clickable, stateful app** you can use for a week,
with sample data instead of a database. Everything responds: tabs filter, Filter
narrows, marking seen removes an item with an Undo, saving to Later moves it,
the Reader opens, the player plays. Nothing is thrown away when the real data
arrives, because all data access sits behind one module that Supabase replaces
later.

## Why this order

- Interaction problems ("marking seen one at a time is tedious") show up in use,
  not in review. This stage finds them in days.
- No accounts, keys or database means nothing to set up and nothing to leak.
- The same codebase becomes the real app. The only thing that changes is what is
  behind `lib/data`.

## What to paste into Claude Code

Open Claude Code in the project folder and paste the block below. It is long on
purpose: a precise brief is the difference between a prototype that matches the
designs and one that merely resembles them.

---

Read CLAUDE.md, docs/build-spec.md and the designs in design/ (start with
design/index.html). Then build an interactive prototype of phase 1, as follows.

**Shape**

- Next.js App Router, TypeScript, plain CSS. No UI framework, no Tailwind.
- All design tokens from spec section 9 as CSS variables on `:root`. Use only
  those values: no new colors, sizes, radii or spacing steps.
- Every piece of data access goes through `lib/data/index.ts`, which exports
  plain async functions (`listItems`, `getItem`, `setItemState`, `listSources`,
  `listFolders`, and so on). Back it with `lib/data/demo.ts`: a seeded in-memory
  store, persisted to localStorage so my changes survive a refresh. No Supabase,
  no network calls, no API keys.
- A `Reset demo data` control in Settings that clears localStorage and reseeds.

**Seed data**

About 8 sources across all kinds (blog, newsletter, YouTube, podcast,
subreddit), 4 folders with overlapping membership, and roughly 40 items spread
over the last two weeks: a mix of unseen, seen, saved to Later and archived,
with realistic titles, authors, durations and reading times. Three items carry
highlights and one carries a note. Images are solid token-color blocks in the
right aspect ratio, never a picture inside a picture.

**Screens, all fully interactive**

1. Home: greeting, what is new, the caught-up state, and the day-one empty state
   when there are no sources.
2. Feed: Everything, grouped by date, tabs for Unseen, Seen and All, Group by,
   Sort, and a working Filter panel (type, length, folder). The list ends with a
   closing sentence and nothing after it.
3. Folder view: the same list scoped to one folder, reached from the sidebar.
4. Reader: full item view with the article body, text size control, Later,
   Archive, delete and open original.
5. Library: Later and Archive, same row component, same control row, Filter
   including folder and tag.
6. Sources: the list with status, and the + Add overlay where pasting a URL adds
   a fake source with a few generated items.
7. Settings: the handful of real toggles plus Reset demo data.

**Behavior that must actually work**

- Marking an item seen removes it from Unseen immediately, with an inline Undo
  in olive that restores it. No toasts.
- Later and Archive move an item between lists and persist.
- Hover or focus on a row reveals exactly three actions: Later, Archive, Mark as
  seen. Everything else lives under the row's overflow menu.
- Tabs, Group by, Sort and Filter all change the list for real, and remember the
  last choice per page.
- Keyboard: Tab reaches everything with a visible olive focus ring, Escape
  closes overlays, Enter opens the focused item.
- Responsive at 1240, 900 and 600px. The phone layout matches the 390px boards.

**Rules from the spec that are easy to break, so check them**

No counts or badges anywhere. No italics. Page headings 32, content titles 40,
empty state headings serif 600 at 20. One control row per list, directly under
the heading, Filter last. Thumbnails fill a fixed 16:9 frame. Red only for
+ Add, new dots, row arrows, the active tab underline and real errors; olive for
actions.

**How to work**

Work on a branch. Commit in small pieces: tokens and layout shell first, then
the data layer and seed, then Feed, then Reader, then Library, then Sources and
Settings. After each commit, run the dev server, check your own work, and tell
me in one or two lines exactly what to click to see the change. Ask me when a
decision is not covered by the spec rather than inventing one. Append a dated
line to DECISIONS.md for every real choice.

---

## After it works

1. Use it daily for a week. Keep a list of what annoys you.
2. Fix the annoyances before adding anything new.
3. Then swap `lib/data/demo.ts` for Supabase and turn on real feed fetching.
   Nothing above that line needs to change, which is the whole point of the
   module boundary.
