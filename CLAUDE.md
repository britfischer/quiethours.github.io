# CLAUDE.md

Read this first, then `docs/build-spec.md`.

## What this project is

A private, responsive reader for one person: blogs, newsletters, YouTube,
podcasts, news, collected deliberately and finite by design. Working name
"Quiet Hours". The owner is a UX design lead and new to building software, so
explain decisions in plain language and avoid jargon unless you define it.

## How to work here

- **The spec is binding.** `docs/build-spec.md` section 2 (product rules) and
  section 9 (design system) are not suggestions. If a request conflicts with
  them, say so before building.
- **Ask rather than invent.** When a design decision is not covered by the spec,
  ask. Do not add features, pages, counts or settings that are not specced.
- **Phases matter.** Build only the phase being asked for. Phase 1 is the daily
  loop: follow a source, see what is new, read it, save or archive it.
- **Small commits on a branch**, one piece of work per branch, with a plain
  message. After each commit, tell the owner exactly what to check.
- **Record decisions.** Append a dated line to `DECISIONS.md` whenever a real
  choice gets made.
- **Verify your own work** before saying it is done: run the dev server, run the
  tests, read the output.

## Stack

Next.js App Router, TypeScript, plain CSS with design tokens as CSS variables.
Supabase for Postgres and auth, with row level security on every table. Hosted
on Vercel, with Vercel Authentication as the private gate until email sign-in
ships in phase 4. Feed fetching runs on a Vercel cron every 30 minutes.

## Hard rules

- Never commit `.env.local` or any key. Secrets live in Vercel's environment
  variables. The Supabase service role key is server side only.
- No counts, badges or notifications anywhere in the UI.
- No italics. Emphasis is color, weight and the serif face.
- Every list gets one control row under the heading: tabs left; Group by, Sort,
  Filter right, Filter last.
- Confirmations are inline with an Undo. No toasts.
- Use only the tokens in spec section 9. No new colors, sizes or radii.
- Thumbnails fill a fixed 16:9 frame. Never an image inside an image.

## Design reference

The 48 screen designs are a clickable prototype at
https://britfischer.github.io/quiethours.github.io/ and the same files live in
the `design/` folder of that repository. They are reference drawings: match the
layout and the tokens, not the placeholder copy.
