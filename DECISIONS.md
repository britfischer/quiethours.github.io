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
