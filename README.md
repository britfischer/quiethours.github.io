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
| `docs/kickoff.md` | The prompt to paste into Claude Code to build the interactive prototype. Start here. |
| `docs/prototype-spec.md` | How the prototype is built and exactly how it behaves, plus the full feedback log. Read with CLAUDE.md. |
| `prototype-single-file/` | The one-file prototype published as an Artifact. No build step. |
| `prototype/` | The Next.js version that becomes the real app. |
| `DECISIONS.md` | One dated line per decision. Why things are the way they are. |

The 47 screen designs live on a Claude Design canvas. Board 0 of that canvas is
the design system, and section 2 and section 9 of the spec are the written
version of it.

## Status

Designs done and published as a clickable prototype. Next step is
`docs/kickoff.md`: build the interactive prototype with sample data, use it for a
week, then wire real feeds and a database.

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
