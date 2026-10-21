# CustomRSS

A private, responsive reader for one person. It collects the blogs, newsletters,
YouTube channels, podcasts and news you actually want, and lets you get through
them without an algorithm or an endless scroll.

Working name: **Quiet Hours** (placeholder).

## Where things are

| | |
|---|---|
| `docs/build-spec.md` | The spec. Principles, binding product rules, stack, data model, ingestion, screens by phase, design tokens. Attach this to Claude Code before building. |
| `docs/the-path.md` | Setup and the working loop, written for a first-time developer. |
| `DECISIONS.md` | One dated line per decision. Why things are the way they are. |

The 47 screen designs live on a Claude Design canvas. Board 0 of that canvas is
the design system, and section 2 and section 9 of the spec are the written
version of it.

## Status

Pre-code. Next step is the ingestion spike in `docs/the-path.md`, part 2:
prove real feeds parse before any UI gets built.

## Phases

1. **The daily loop.** Follow a source, see what's new, read it, save or archive it.
2. **Organize.** Folders, highlights and notes, tags, search, rules.
3. **Listen and watch.** Audio and video playback, mini player, queue, resume.
4. **The rest.** Email sign-in, OPML, creators, discover, learning paths, e-ink mode.

## Principles

1. It ends. Every list finishes with a sentence.
2. Quiet by default. No counts, badges, notifications or recommendations.
3. You decide what comes in.
4. Reduction over features.
5. Magazine, not dashboard.
