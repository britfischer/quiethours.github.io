# Build spec: a calm reader for one person

Working name: **Quiet Hours** (placeholder, swap it when you pick a name).
Design reference: the canvas with 47 screens. Board 0 holds the design system.
Audience for this document: Claude Code, and you.

---

## 1. What this is

A private, responsive website where one person collects everything they actually
want to read, watch and listen to, and gets through it without an algorithm.
It replaces doomscrolling with a finite pile that ends.

**Principles, in priority order**

1. **It ends.** Every list finishes with a sentence. Nothing offers more content
   after you are done.
2. **Quiet by default.** No counts, no badges, no notifications, no infinite
   scroll, no recommendations.
3. **You decide what comes in.** Content enters only because the user followed a
   source or pasted a link.
4. **Reduction over features.** When two things do the same job, keep one.
5. **Magazine, not dashboard.** Generous type, real images, one accent color.

**Explicit non-goals**

- No social features, sharing feeds, comments or follower counts.
- No AI summaries or auto-curation in v1.
- No multi-user teams. One account per person.

---

## 2. Product rules that must not drift

These come off board 0 and are binding on every screen.

- **Pill nav = places.** Home, Feed, Library, Listen, Sources. Underline tabs =
  state only (Unseen, Seen, All), never type.
- **Every list has one control row of its own, directly under the page heading,
  never in the heading row:** tabs on the left; Group by, Sort, Filter on the
  right, Filter last. Group by defaults to None, Sort to Newest first. Both
  remember the last choice per page.
- **Type, source, length, folder and tag filters live inside Filter.** Nothing
  filter-shaped sits loose on the page.
- **Everything** is a fixed destination above the folder list. It cannot be
  renamed or deleted and has no folder menu. It always shows one scroll of all
  incoming items.
- **Folders are labels, not boxes.** A source can sit in several folders or none.
  Folder changes never remove anything from Everything.
- **Row shape never changes with state.** The folder chip and the overflow menu
  are always present. Hover or focus reveals three actions: Later, Archive,
  Mark as seen. Everything else is under the overflow menu.
- **Thumbnails fill a fixed 16:9 frame.** No image inside an image. 120px wide
  on desktop, 84px on phone.
- **Confirmations are inline where the thing happened, with an olive Undo.**
  No toasts, no disappearing popups.
- **Counts are off by default.** No badges on tabs, no number on the app icon.
  Later and unfinished things never create a count.
- **Red is for the + Add trigger, new dots, row arrows, the active tab underline
  and real errors. Olive is for actions.** Never swap them.
- **A page gets a heading, not a description.** Instructional lines are allowed
  only in the + Add overlay, the rule editor and onboarding.
- **No italics anywhere.** Emphasis is color, weight and the serif face.
- **Rules apply automatically.** No "also apply to existing items" checkbox.
- **Search is an overlay only.** There is no search page.
- **Keyboard and screen reader:** visible focus ring on everything focusable
  (2px olive, 2px offset), 44px minimum hit targets, real buttons and links.

---

## 3. Stack and hosting

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Most documented path, so Claude Code makes fewer mistakes |
| Styling | Plain CSS with design tokens as CSS variables | The design is already expressed this way; no framework to fight |
| Hosting | Vercel, free Hobby plan | Git push deploys; cron jobs included |
| Database and auth | Supabase, free tier | Postgres, row level security, email magic links when needed |
| Feed parsing | a maintained RSS/Atom parser | Do not hand roll XML parsing |
| Article extraction | a Readability-style extractor + HTML sanitizer | Feeds are often truncated |
| Scheduled fetching | Vercel Cron, every 30 minutes | Matches the "we'll check again in about 30 minutes" copy |

**Privacy while testing, with no account system built:** turn on Vercel
Authentication (Deployment Protection) for the project. Only people signed into
the owner's Vercel account can open the site, production included. Password
protection is a paid feature and is not needed. Replace the gate with Supabase
email sign-in in phase 4.

**Secrets** live in Vercel environment variables and `.env.local`. Never in the
repo. The service role key is server side only, never shipped to the browser.

---

## 4. Data model

Supabase Postgres. Every table carries `user_id` and has row level security so a
row is only visible to its owner.

```
sources
  id, user_id, kind ('blog'|'youtube'|'podcast'|'newsletter'|'reddit'|'other'),
  title, display_name, feed_url, site_url, icon_color,
  status ('ok'|'needs_attention'|'error'), error_message,
  etag, last_modified, last_fetched_at, auto_save_to_later bool,
  hide_shorts bool, created_at

folders
  id, user_id, name, position, created_at

source_folders
  source_id, folder_id          -- many to many, this is what makes folders labels

items
  id, user_id, source_id, guid (unique per source), kind ('article'|'video'|'podcast'|'discussion'),
  title, url, author, published_at, summary,
  content_html (sanitized, extracted when the feed is truncated),
  image_url, media_url, duration_seconds, created_at

item_state
  item_id, user_id, seen_at, saved_at, archived_at, deleted_at,
  progress_seconds, scroll_percent, note (one per item), updated_at

highlights
  id, item_id, user_id, text, char_start, char_end, created_at

tags / item_tags
  tags: id, user_id, name
  item_tags: item_id, tag_id

rules
  id, user_id, name, enabled, position,
  conditions jsonb,   -- e.g. [{field:'kind',op:'is',value:'video'},{field:'duration',op:'<',value:60}]
  action jsonb        -- e.g. {type:'folder', folder_id:'...'} | {type:'hide'} | {type:'later'} | {type:'tag', tag_id} | {type:'queue'} | {type:'seen'}

queue
  user_id, item_id, position     -- Up next for Listen

paths / path_items                -- phase 4, the learning path
  paths: id, user_id, title, goal, position
  path_items: path_id, item_id, position, done_at
```

**Derived, never stored:** unseen counts, "all caught up" state, folder item
counts. Compute them.

**State is one row per item.** Later, Archive and seen are timestamps on
`item_state`, not separate shelves. Library reads the same items the Feed does.
This is what keeps Everything honest.

---

## 5. Ingestion, the risky part

Build and test this before any UI.

**Resolving what the user pasted**

| Pasted | Resolution |
|---|---|
| A feed URL | Use it |
| A blog or news site | Look for `<link rel="alternate" type="application/rss+xml">`, then try `/feed`, `/rss`, `/atom.xml`, `/index.xml` |
| A Substack URL | `<publication>/feed` |
| A YouTube channel, handle or video URL | Resolve to a channel id, then `https://www.youtube.com/feeds/videos.xml?channel_id=<id>` |
| A podcast RSS URL | Use it; episodes are `<enclosure>` audio |
| An Apple Podcasts URL | iTunes lookup API returns the real `feedUrl` |
| A subreddit | `https://www.reddit.com/r/<name>/.rss` |
| A site with no feed | Phase 4. Say so plainly in the UI rather than pretending |

**Fetching**

- Conditional GET with stored ETag and Last-Modified. Do not refetch unchanged feeds.
- Deduplicate on `guid`, falling back to the item URL.
- On first follow, mark everything older than the follow date as seen, so a new
  source does not dump 2,000 unseen items. This matches the OPML import toggle.
- Three consecutive failures sets `status = 'needs_attention'` and surfaces the
  source in the Sources list. Never fail silently.
- Fetch full content when the feed body is truncated, then sanitize. If
  extraction fails, keep the feed excerpt and link out.
- Respect a feed's `ttl` where present, otherwise 30 minutes.

**Known limits to state out loud, not discover later:** paywalled articles will
not extract, some podcast hosts block server-side fetching, Apple Podcasts and
Spotify cannot export subscriptions, YouTube has no OPML.

---

## 6. Screens, by navigation and phase

Boards are on the canvas; numbers below match the board titles.

| Area | Screens | Phase |
|---|---|---|
| Everywhere | + Add overlay (link, follow, error states), search overlay, item overflow menu, new folder dialog, mini player | 1 (add, menu), 2 (search), 3 (player) |
| Home | greeting, reading time card, caught-up card, day one empty state, folders on Home picker | 1 (day one, greeting), 2 (cards) |
| Feed | Feed with unseen, folder view, empty folder, all caught up, Reader | 1 (Feed, Reader, caught up), 2 (folders) |
| Library | Later, Archive, Highlights and notes, export highlights, smart filter | 1 (Later, Archive), 2 (highlights, tags), 4 (smart filter) |
| Listen | Listen and watch, video player, show page | 3 |
| Sources | Sources list, source menu, creators, creator page, rules, rule editor, discover, site with no feed | 1 (list, menu), 2 (rules), 4 (creators, discover, no feed) |
| Settings | settings, sign in, welcome | 1 (settings basics), 4 (real sign in, onboarding) |
| Narrow screens | the same site, responsive, at phone width, plus e-ink mode | every phase, 4 for e-ink |

**Responsive:** one site, not an app. Breakpoints at 1240, 900 and 600. On phone
the sidebar collapses into the folder control, rows keep 84px thumbs, the player
docks to the bottom, and type drops one step (display 30, section 24, row title
17, meta 12).

---

## 7. Two data modes

Both ship from day one.

- **Real mode** starts completely empty and shows the day-one screens: "Good
  morning. Let's add some content." plus the three step checklist.
- **Demo mode**, behind `SEED_DEMO=true` or a `/demo` route, seeds a plausible
  library: about 8 sources across all kinds, 40 items with a mix of seen, unseen
  and saved, 4 folders, a few highlights and one rule. Use it to test crowded
  screens, grouping, filters and the caught-up state without waiting for real
  content.
- Seeding is idempotent and never touches real rows.

---

## 8. Phases, with acceptance criteria

### Phase 0: ingestion spike (before any UI)

A script, not a site. Takes a list of URLs, resolves each to a feed, fetches it,
prints kind, title, item count, newest item date and whether full content could
be extracted.

Done when: every source type in section 5 either parses or is explicitly logged
as unsupported, and the output is a table you can read.

### Phase 1: the loop you use daily

Follow a source, see what is new, read it, deal with it.

- + Add overlay: paste a link, resolve it, pick a display name, follow.
- Cron fetch every 30 minutes; manual "check now" in Settings.
- Feed: Everything, grouped by date, tabs for Unseen, Seen, All, Sort working,
  Filter present with type and length.
- Row actions: Later, Archive, Mark as seen, with inline Undo.
- Reader: clean extracted content, progress bar, Aa text size, Later, Archive,
  delete, open original.
- Library: Later and Archive lists, same rows, same controls.
- Sources list with status, including needs attention.
- Empty states: day one Home, caught up Feed, empty Later.
- Demo seed.
- Deployed to Vercel with Vercel Authentication on.

Done when: you follow 10 real sources, read in it for a week, and never open the
old reader.

### Phase 2: organize

Folders and the folder sidebar, folder membership editor, Everything standalone,
Library filter with folder and tag, highlights and notes (one note per item),
search overlay with scopes and filters, rules and the rule editor (applying
automatically), Home cards.

Done when: you can say "only Wellness, only under 10 minutes" in two clicks, and
your highlights are worth exporting.

### Phase 3: listen and watch

Audio player with speed and skip, YouTube embed, mini player docked bottom
centre with queue popover, Up next, show and channel pages, progress saved per
item, resume where you left off, listen-only mode for video.

Done when: a podcast you start on the laptop resumes on the phone.

### Phase 4: the rest

Supabase email sign-in replacing the Vercel gate, OPML import and export,
creators grouping, discover directory, smart filters, learning paths, sites with
no feed, e-ink mode, highlight export.

---

## 9. Design system, for implementation

Define these as CSS variables on `:root` and use nothing else.

**Surfaces** `#F9F8F4` page, `#FFFFFF` card, `#EFEDDD` soft, `#E8E6D2` softer,
`#E7E4DA` control. **Divider** `#D5D0C3`. **Border** `#CDCAA6`.
**Ink** `#2F3020` primary, `#5E5D46` muted, `#4D4C38` body.
**Action** `#4F5121` olive, `#6B6B2F` olive light.
**Attention** `#B23A26` red, `#8F2E1E` deep red, `#F08A6E` coral.
**Media placeholders** `#DCD7E4`, `#E8D6C8`, `#CDCAA6`, `#E2DED2`, `#45442A`, `#DCDAC0`.
**Problem** `#F3E3DE`. **Scrim** `rgba(47,48,32,.45)`.

**Type.** Literata (serif) for titles and reading, Figtree (sans) for interface.
Serif scale 52 / 44 / 40 / 32 / 28 / 22 / 20 / 18. Sans 16 / 15 / 13 / 13 caps /
12. Page headings are 32. Display 44 is the Home greeting and onboarding only.
52 is sign-in. 40 is the title of a piece of content you have opened. Empty state
headings are serif 600 at 20, the smallest heading in the system.

**Spacing ramp** 4, 6, 8, 12, 16, 20, 24, 28, 32, 48, 56, 64. Nothing off ramp.
**Radii** 6, 12, 16, 20, 24, 28, 999. **Controls** 40 / 44 / 48 high.
**Thumbs** 120 desktop, 84 phone, 16:9, art fills the frame.

**Components to build once:** button (olive, soft, ghost, destructive), field,
select, checkbox, switch, chip, badge, list row, tabs, control row, menu,
dialog, filter panel, empty state, inline confirmation, player bar.

---

## 10. Open questions

1. The name. Forty something references across the canvas will need renaming
   once you pick one.
2. Does Home need its own greeting copy per time of day, or one line all day?
3. Highlights export format: Markdown, or straight into a notes app?
4. Do you want the reading-time card on Home to be configurable, or fixed at a
   quiet hour?
