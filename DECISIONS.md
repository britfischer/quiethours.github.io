# Decisions

One line per decision, newest at the bottom. Date, the decision, and why.

- 2026-10-20: **Stack is Next.js + TypeScript on Vercel, data in Supabase.** Most
  documented path, so AI-assisted building makes fewer mistakes. Free tiers cover
  a single user.
- 2026-10-20: **Private while testing via Vercel Authentication**, not a password
  or a secret URL. Free, no auth code, and only the owner can open the site.
  Real email sign-in lands in phase 4.
- 2026-10-20: **Everything is a fixed destination, not a folder.** It cannot be
  renamed or deleted and always shows one scroll of all incoming items.
- 2026-10-20: **Folders are labels, not boxes.** A source can sit in several
  folders or none, and folder changes never remove anything from Everything.
- 2026-10-20: **Later, Archive and seen are timestamps on one item state row,**
  not separate shelves. Library and Feed read the same items.
- 2026-10-20: **Inbox removed.** The Feed is already the untriaged pile, so a
  second holding shelf had no job.
- 2026-10-20: **Folder tree removed from Library.** Folder moved inside the
  Filter panel there. Feed keeps its folder sidebar, because switching folder is
  how you change reading mood in one click.
- 2026-10-20: **One control row per list,** directly under the page heading:
  tabs left; Group by, Sort, Filter right, Filter last. Same position on every
  screen.
- 2026-10-20: **No italics anywhere.** Emphasis is color, weight and the serif face.
- 2026-10-20: **Page headings are 32.** Display 44 is the Home greeting and
  onboarding only; 40 is the title of content you have opened; empty state
  headings are serif 600 at 20.
- 2026-10-20: **Counts off by default**, no badges, no app icon number.
- 2026-10-20: **Rules apply automatically** to existing and incoming items. No
  opt-in checkbox.
- 2026-10-20: **Build in phases, not all at once.** Phase 1 is the daily loop,
  usable in weeks rather than months. Everything else is specced and queued.
- 2026-10-20: **Ship empty by default, with a seeded demo mode behind a flag,**
  so crowded screens can be tested without waiting for real content.
- 2026-10-21: **Real toasts replace inline confirmations.** Drop down from the
  top, hold 10 seconds, pause on hover, carry Undo, no countdown bar. The
  earlier no-toasts rule is withdrawn; scope for destructive actions is open.
- 2026-10-21: **The folder chip sits in a row's meta line**, after source, length
  and time, not floated at the row's right edge.
- 2026-10-21: **Home folders are cards**, each with a red folder glyph, minutes and
  a count of what is new. Columns of titles were tried and reverted.
- 2026-10-21: **Home shows reading progress**: minutes cleared in the last 24 hours
  against a 30 minute quiet hour.
- 2026-10-21: **Two prototypes on purpose**: a single HTML file for review and
  sharing, and the Next.js copy that becomes the app. docs/prototype-spec.md keeps
  them in step.
- 2026-10-21: **The site header is on every page, the reader included.** The
  reader keeps a second bar under it for what belongs to the piece: Back, Aa,
  Highlight, Note, Later, Archive, and a ⋯ holding Open original, Copy link and
  Delete. Board 3.5 has no header and now needs updating.
- 2026-10-21: **Highlighting happens at the cursor.** Selecting text raises a
  small bar over the selection; clicking a highlight offers to remove it. The
  sidebar section is a list, not a button.
- 2026-10-21: **Highlights, notes and tags live in Library,** on the Highlights
  and notes shelf, and are reachable by search. The Feed stays about what is new.
- 2026-10-21: **+ Add does two jobs,** from boards 1.1 and 1.2: save one thing,
  or follow a source. One-off saves hang off a hidden holder and never appear in
  Sources.
- 2026-10-21: **A source is a filter, a folder is a place.** Picking a source
  keeps you on the Feed with a removable chip; a folder still takes the heading.
- 2026-10-21: **One section-header rule everywhere:** 2px line, 18px of air, the
  label, 10px to the first item. Rails and the reader sidebar share it.
- 2026-10-21: **One row pattern:** title clamped to two lines, meta on one line
  in the order source, when it arrived, length. On a shelf "when" is when you
  put it there.
- 2026-10-21: **Fetch frequency is one global setting,** in Settings, not a
  per-source option.
- 2026-10-22: **The filter panel matches the boards:** an All chip on Type, the
  "Sources in this list" checklist with counts from the folder board, Tag chips
  from the Library board, and Length with no Any chip. Counts here are the
  documented exception to the no-counts rule.
- 2026-10-22: **The item count sits under the line that starts the list,**
  bottom left, on every list page without tabs. Export on Highlights & Notes is
  a text button on that same line.
- 2026-10-22: **Highlights are drawn as board 4.3 has them:** a red rule with
  the words washed. Tags sit in the Library rail under the shelves.
- 2026-10-22: **The reader drops the standfirst;** source, time and length sit
  directly on the title.
- 2026-10-22: **Lists end with a count, not a sentence.** The closing line is
  replaced on every page by the list's rule and a small right-aligned count.
  This retires principle 1 ("Every list finishes with a sentence"); the spec
  needs updating to match.
- 2026-10-22: **One count per list, at the end, small and right-aligned.** The
  count under the list's opening rule is removed everywhere. Export on
  Highlights & Notes sits on that end line, opposite the count.
- 2026-10-22: **Highlights & Notes is a running list, newest first,** after
  Instapaper's Highlights list. Each entry is the marked words with the article
  and source under them; opening it lands at that highlight. Group by Article or
  Tag is available but off by default, since articles carry few highlights.
- 2026-10-22: **A tag is a place, not a filter.** A tag in the Library rail opens
  its own page of everything carrying it, like a folder; Filter there is Type and
  Length only.
- 2026-10-22: **Folders can be renamed and deleted** from a ⋯ beside the folder
  page's heading. Delete asks first in a dialog (an exception to inline
  confirmation, by request). Deleting removes the label only: sources stay
  followed and every item stays in the Feed. Undo restores it.
- 2026-10-22: **Fixes from a usability pass:** Resume really resumes a paused
  source; archived items can be moved back out; the Feed rail lists every
  source; Back returns to the exact page, folder or source you came from; row
  menu Add tags opens the tag field; on phones the site header scrolls away.
- 2026-10-22: **Pausing a source offers a length:** 3 days, 1 week, 2 weeks,
  1 month, or until you resume. The source comes back on its own when the date
  passes, and its row says "Paused until <date>". "Mute" is renamed "Pause".
- 2026-10-26: **The three reading settings work.** Mark as seen on scroll marks
  Feed rows seen as they leave the top of the window. Show unread counts adds a
  small count beside Everything, folders and sources in the Feed rail, off by
  default. Open the original skips the reading view. No "With notes" filter.
- 2026-10-26: **No mark-as-seen-on-scroll.** Something stops being new only when
  you mark it seen or open it. The setting is removed.
- 2026-10-26: **The prototype runs on a snapshot of the owner's real sources**
  (from the feed test): headlines, dates, links and a one-line preview only.
  Article text stays placeholder, because the repo and site are public. Video
  lengths are placeholders; YouTube's feed omits them. The two Substacks show
  their real state: not updating.
- 2026-10-26: **The prototype shows real images and plays real media.** Pictures
  fill the 16:9 frame (falling back to the source colour); YouTube videos play in
  YouTube's embedded player; podcast episodes play for real in the mini player;
  Open original opens the real page. Full article text waits for the private
  app, because the prototype is public.
