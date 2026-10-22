# Prototype spec: how to build it, how it behaves

Written for whoever picks this up next, including a future session of Claude.
Read this with `CLAUDE.md` and `docs/build-spec.md`. This file covers the
prototype specifically: how it is put together, exactly how each screen
behaves, every piece of feedback the owner has given, and what is still open.

---

## 1. There are two prototypes, on purpose

| | Single-file prototype | Next.js prototype |
|---|---|---|
| Where | A published Artifact, one `.html` file | `prototype/` in this repo, exported to `/app` |
| Why | Opens instantly in chat, shares with one link, needs no build | Becomes the real app once Supabase replaces the data module |
| Stack | Plain HTML, CSS variables, vanilla JS, no libraries | Next.js App Router, TypeScript, plain CSS |
| State | `localStorage`, one JSON blob | Same model, React context in `lib/store.tsx` |
| Audience | The owner and reviewers | The build |

**Keep them in step.** A change made in one is specified here so the other can
follow. When they disagree, this file is right and the code is behind.

---

## 2. How to work on the single-file prototype

- One file. Styles at the top in a `<style>` block, then `<div id="app">`, then
  one `<script>`.
- **No build step, no libraries, no imports.** Everything is inline, which is
  what makes it publishable as an artifact.
- Rendering is a full redraw: `render()` builds a string of HTML for the current
  view and assigns it to `#app.innerHTML`. There is no diffing and no framework.
  It is fast enough for 40 items and it keeps the code readable.
- **Events are delegated.** One `click` listener on `document` reads
  `data-*` attributes (`data-go`, `data-read`, `data-act`, `data-folder`,
  `data-play`…). Never attach a listener to a rendered element; it will be
  destroyed on the next redraw.
- **Anything that must survive a redraw lives outside `#app`.** The toast layer
  is a sibling div written to directly, which is why its 10 second timer is not
  killed every time the list re-renders.
- Checks before publishing: parse the script (`new Function(scriptSource)` in
  node), confirm no `data-*` hook is referenced but missing from the delegated
  selector list, and confirm the file still parses as one `<script>`.

**State shape** (persisted under `quiet-hours-proto-v1`):

```
{ version, folders:[{id,name}], sources:[{id,title,kind,site,color,status,folders[]}],
  items:[{id,sourceId,title,standfirst,body[],kind,minutes,publishedAt,
          seenAt,savedAt,archivedAt,deletedAt}],
  settings:{markSeenOnScroll,showCounts,openOriginal} }
```

Item state is four timestamps on one row, never separate lists. Everything the
UI shows is derived: `isUnseen`, `isSeen`, `isLater`, `isArchived`, counts,
minutes, the caught-up state. List preferences persist separately per list under
`qh-prefs-<key>`.

View state (`V`) is in memory only: current view, selected folder, open item,
shelf, overlay, open menu, filter panel, reader text size, player.

---

## 3. How the app behaves, screen by screen

### Header, on every screen except the Reader
Brand mark, pill nav of the five places (Home, Feed, Library, Listen, Sources),
search icon, red + Add. The pill nav marks the current place. Nothing else.

### Home
In order, top to bottom:
1. **Greeting row.** Left: date and time stamp in muted 15px, then the hero
   greeting (time-aware: morning, afternoon, evening) with the second line in
   red: "Here's what's new." or "You're all caught up." Right: the
   **reading-time card**, 300px, white, showing "Today's reading time",
   "18 of 30 min", a bar, and "12 minutes left in today's quiet hour." The
   number is the sum of minutes of everything marked seen in the last 24 hours,
   against a 30 minute goal. It moves as you clear things.
2. **Featured.** The newest unread article: art panel, "Featured · <folder>",
   serif headline, standfirst, source and read time, Read now plus Later.
3. **Fresh today.** Heading plus "New since you last stopped by. Skim, save or
   let it go.", an "Open the Feed" link, then five live rows. No closing
   sentence here: Home is a doorway, not a list that ends.
4. **Your folders.** Up to four **cards**: red folder glyph in a blush circle,
   minutes at the right, folder name in serif 22, then "2 to look at" or
   "Nothing new". With more than four folders a link appears beside the gear.
   The gear is where you choose which folders are on Home.
5. **For your walk.** Up to two wide olive-sand cards for unread podcasts and
   video: 120px thumb, "Podcast · 41 min", serif title, round olive play button.
   Play docks the mini player.
6. **Waiting for you later.** Three oldest saved items as white cards: "Saved 12
   days ago" above the serif title.

When no sources exist, Home is day one instead: greeting with "Let's add some
content." and three numbered steps.

### Feed
Left rail: Everything on its own above the Folders list, then Folders, then
Sources with a Manage link. Main: heading, then the control row, then rows
grouped by date.

### Library
Shelves rail: Later and Archive only. Same rows, same control row. Later sorts
by Recently saved; Archive by Recently archived.

### Listen
One list of unread podcasts and video with its own control row. Playback is
phase 3 and the page says so.

### Sources
List of sources with kind, last post, and a red "Not updating, check the link"
state. Tabs for All, Blogs, Video, Podcasts, plus "Needs attention · 1" when
something is broken. + Add overlay creates a source with three posts.

### Reader
Its own sticky bar: Back, Aa text size (18 to 24 and round again), Later,
Archive, delete. Progress hairline underneath. Then source line, title at 40,
standfirst at 20, art panel, body at the chosen size, and a closing line:
"The end. Nothing else is queued up after this." Opening an item marks it seen.

### Settings
Three real toggles (mark seen on scroll, show counts, open original), then the
prototype controls: Reset demo data and Start empty.

### Overlays
**+ Add**: paste a link, optional folder, Follow. Catches empty input, a string
with no dot, and a source already followed, each with its own message in the
blush alert style. **Search**: scope chips (Everywhere, Feed, Library, Sources),
live results with the match highlighted, grouped items then sources.

### Mini player
Docked bottom centre, olive pill: art, title, source and length, play or pause,
progress, close. Follows you between screens. No audio in the prototype.

---

## 4. Interaction rules that are easy to get wrong

- **Row actions** appear on hover or focus, and are always visible on touch and
  at phone width. Exactly three: Later, Archive, Mark as seen. Everything else
  is under the row's ⋯ menu, which also holds Delete in deep red.
- **Every state change raises a toast** (section 5) with Undo.
- **The folder chip lives in the row's meta line**, after source, length and
  time. Never floated at the right edge of the row.
- **Tabs, Group by, Sort and Filter all really work** and are remembered per
  list. Group by Date is the Feed's default; everywhere else None.
- **Filter holds type, folder and length.** Nothing filter-shaped sits loose on
  a page.
- **Lists end with a sentence** and nothing follows it. Home is the exception.
- **Counts stay off** except where a number is the content itself: minutes on a
  folder card, "Needs attention · 1", "Unseen" has no badge.
- **Escape** closes an overlay, then a menu or the filter panel. Enter in the
  Add field follows the link.
- Opening something from anywhere marks it seen, including from search and from
  the player.

---

## 5. Toasts

The owner asked for real toasts, which replaces the earlier inline-confirmation
rule. Record the change in `DECISIONS.md` and keep the spec in step.

- Drops down from the top centre, 520px wide, card surface with a hairline
  border and a soft shadow, 16px radius, 14px padding.
- Olive check in a sand circle, the verb at 15px semibold, the item title at
  13px muted and truncated to one line.
- **Undo** as a sand pill that turns olive on hover. A close button beside it.
- Holds **10 seconds**, pauses while the cursor is on it, then 4 seconds after
  the cursor leaves. **No countdown bar**: the owner found it noisy.
- One at a time. A new toast replaces the one before it.
- At phone width the icon drops and the padding tightens.

---

## 6. Sample data

Eight sources across every kind, four folders with overlapping membership, about
40 items spread over 18 days, plus:

- Three items marked seen earlier today, so the reading-time bar starts part way
  along instead of at zero.
- Four saved items aged 2 days, 12 days, 3 weeks and 34 days, so "Waiting for
  you later" reads like a real backlog.
- Five archived items aged 4 to 40 days.
- One source (The Pricing Pod) deliberately in the needs-attention state.

Art is solid token colour per source, filling a fixed 16:9 frame. Never an image
inside an image, and no borrowed photographs.

---

## 7. Feedback log

Every change the owner has asked for, newest last. Treat these as settled.

- Thumbnails must fill a fixed 16:9 frame, never an image nested in an image.
- Folder lists show everything, no "Show more".
- Filters hide behind a Filter control, placed last in the control row.
- Notes sit above highlights, one note per item.
- Rules apply automatically; no "also apply to existing items" checkbox.
- Search is an overlay only; the full-page search was deleted.
- The mini player has one size. The bubble and the compact variant were both cut.
- Phone is the same responsive website, not an app.
- Page headings carry no tagline.
- No italics anywhere.
- Page headings are 32; display 44 is Home and onboarding only; content titles
  40; empty-state headings serif 600 at 20.
- Everything sits above the folder list, not inside it, and cannot be deleted.
- Folders are labels: a source can sit in several or none, and folder changes
  never remove anything from Everything.
- Inbox removed: the Feed is already the untriaged pile.
- The folder tree came out of Library; folder moved into Filter there.
- Tabs, Group by, Sort and Filter sit in one row directly under the page
  heading, same place on every screen, Filter last.
- Per-group "Mark these as seen" links removed; that action lives in the folder
  ⋯ menu and on Home.
- Empty-state headings much smaller but still bold.
- Buttons lose their counts: "Open Later", not "Open your Later shelf · 3".
- Home must match the board: greeting beside the reading-time card, featured
  card, Fresh today with controls, folders, For your walk, Waiting for you.
- Reading progress on Home is required.
- Real toasts that drop down and dismiss after 10 seconds, with better padding,
  type and colour, and no second countdown.
- The folder chip must sit with the content, not at the row's right edge.
- No "more are waiting in the Feed" line under Fresh today.
- A red folder icon on each folder for a pop of colour.
- Home folders are **cards**, not columns. (Reverted after trying columns.)

- The site header is on every page, the reader included; the reader's own bar
  sits under it and holds Back, Aa, Highlight, Note, Later, Archive and a ⋯ for
  Open original, Copy link and Delete.
- Highlighting happens where the cursor is: select text and a bar appears over
  the selection. Clicking a highlight in the text offers to remove it.
- Highlights are painted back into the body wherever they were made, all of them.
- Highlights, notes and tags live on the Library's Highlights and notes shelf,
  which groups by item, folder or tag, filters, and exports. They are searchable,
  and search has a scope chip for them.
- + Add does two jobs: save one thing, or follow a source. One-off saves never
  become a subscription and stay off the Sources page.
- Picking a source filters the Feed and shows a removable chip; the heading stays
  "Feed". A folder still takes the heading.
- One section-header rule everywhere: 2px line, 18px of air, label, 10px of air.
- One row pattern: title clamped to two lines, meta on one line as source, when
  it arrived, length. On Later and Archive that is when you put it there.
- Rows end in the red arrow glyph the boards have.
- How often feeds are checked is one global setting in Settings.

---

## 8. Still open

1. **The name.** Working name only, about 40 references to change.
2. **Toast scope.** Decide whether destructive actions keep an inline
   confirmation or also use a toast, then update `docs/build-spec.md` section 2
   and board 0 so they stop contradicting the build.
3. **Art.** Solid colour panels stand in for images. Abstract gradients per
   source would read more like a magazine without borrowing photographs.
4. **Phases 2 to 4** are unbuilt in both prototypes: highlights and notes, tags,
   rules, real playback, creators, discover, learning paths, OPML, e-ink.
5. **Ingestion is still untested.** No feed has been fetched. This remains the
   largest unknown in the project and no amount of prototype polish reduces it.
6. **Board 3.5 and the design system board need updating** to match the reader's
   new header, and the toast rule still contradicts board 0.
7. **GitHub Pages deploy is failing** on the deploy step; the logs are not
   reachable from the session. The repo's Settings → Pages source needs a look.

---

## 9. How to improve the prototype next

In order of value:

1. Fix whatever the owner names in the next round of comments. Her feedback has
   been specific and fast; nothing else beats it.
2. Bring the Next.js copy in `prototype/` up to this spec, so the two stop
   drifting: Home sections, toasts, folder chip placement, folder cards.
3. Build phase 2 into the single-file prototype first, where iteration is
   cheapest: highlights and notes in the Reader, tags, folder management.
4. Only then wire ingestion and Supabase in the Next.js copy.

When adding anything, check it against section 4 and section 7 before building.
Most review comments so far have been a rule in section 4 getting broken, not a
new idea.
