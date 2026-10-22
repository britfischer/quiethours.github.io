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
