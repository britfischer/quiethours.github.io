# The path

One route, start to finish. No choices to make. This is the standard
professional setup, scaled down to one person: code on your machine, history in
git, a private repo on GitHub, previews and production on Vercel, data in
Supabase.

Design parallel, since it may help: your Mac is the working file, git is version
history, GitHub is the shared library, a Vercel preview is a review link, and
production is the published piece.

---

# Part 1: set up once (about an hour, one evening)

Do these in order. Everything here is free.

### 1. Open Terminal
Command + Space, type `terminal`, press Return. Leave it open.

### 2. Install Node
1. Go to **nodejs.org** and download the **LTS** build for **macOS Apple Silicon (ARM64)**.
2. Open the downloaded `.pkg`, click through, enter your Mac password.
3. Quit Terminal, reopen it, then check:
   ```
   node -v
   ```
   A version number means it worked.

### 3. Install Claude Code
```
npm install -g @anthropic-ai/claude-code
```
If it refuses with a permissions error, repeat it with `sudo` in front and enter
your Mac password. Typing a password shows nothing on screen. That is normal.

### 4. Create the three accounts
1. **github.com**, sign up. This is version history and the home of your code.
2. **vercel.com**, "Continue with GitHub". This builds and serves the site.
3. **supabase.com**, "Continue with GitHub". This is the database. Create a
   project, choose a region near you, and save the database password somewhere
   safe.

### 5. Make the project folder
```
mkdir -p ~/Projects/quiet-hours
cd ~/Projects/quiet-hours
claude
```
Sign in when prompted. You are now in Claude Code, in the right folder. `cd`
means "work in this folder", and Claude Code only touches the folder you are in.

---

# Part 2: prove the content pipeline works (one evening)

No website yet. This step exists because feeds are the one part of this product
that might not work, and finding that out now is worth an evening.

In Claude Code, paste:

> Create a standalone Node script `spike.mjs` that reads a list of URLs from
> `feeds.txt` and for each one: resolves it to a feed URL (handling plain RSS, a
> site home page with a feed link tag, Substack, a YouTube channel or handle, an
> Apple Podcasts link, and a subreddit), fetches the feed, and prints a table
> with input URL, resolved feed URL, detected kind, feed title, item count,
> newest item date, whether the newest item has full content or only an excerpt,
> and any error. No website. Use a maintained feed parser. End with a summary of
> which inputs failed and why.

Put 15 sources you actually read into `feeds.txt`, then:
```
node spike.mjs
```

Read the table. Anything that fails here is a real constraint on the product,
not a bug to push through.

---

# Part 3: set up the repo and hosting (30 minutes)

### 1. Create the project and first commit
In Claude Code:

> Set up a Next.js App Router project with TypeScript in this folder, plain CSS
> with design tokens as CSS variables, and a `.env.local.example`. Make sure
> `.gitignore` covers `.env.local`. Initialise git, commit everything, and give
> me the exact commands to create a **private** GitHub repo and push to it.

Run the commands it gives you.

### 2. Connect Vercel
1. Vercel dashboard, **Add New Project**, import your repo, deploy with defaults.
2. **Settings → Deployment Protection → turn on Vercel Authentication**, for
   production as well as previews. Now only you can open the site.
3. **Settings → Environment Variables:** add your Supabase URL, anon key and
   service role key. Mark the service role key server side only.

From now on, every push to GitHub deploys automatically.

---

# Part 4: build, using the loop professionals use

This cycle is the whole job. You will repeat it dozens of times.

```
1. git pull                          bring down anything newer
2. git checkout -b feed-list         start a branch for one piece of work
3. claude                            describe the piece, let it build, review the diff
4. npm run dev                       check it at localhost:3000 yourself
5. git add -A && git commit -m "..." save a point you can return to
6. git push -u origin feed-list      Vercel builds a private preview URL
7. open the preview on your phone    check it on a real device
8. merge the branch on GitHub        it goes to production
```

**Why each step exists**

- **Branches** mean an experiment can be thrown away without harming what works.
- **Small commits** are undo points. One commit per working piece, not one per day.
- **Preview URLs** are how teams review before publishing. Yours is private.
- **Merging to main** is publishing. Vercel keeps every version, so if production
  breaks you click **Instant Rollback** in Vercel and it is fixed in seconds.

**Start the build with this prompt**, with `reader-build-spec.md` attached:

> Read reader-build-spec.md. Build phase 1 only, nothing from later phases.
> Order: Supabase schema with row level security, then ingestion and the cron
> route, then the UI. Follow section 2 and section 9 exactly: the control row
> pattern, fixed 16:9 thumbnails, inline confirmations with Undo, no counts, no
> italics, page headings at 32, tokens as CSS variables. Include the demo seed
> behind a flag. If a design decision is not covered by the spec, ask me instead
> of inventing one. Work in small commits on a branch, and after each one tell
> me exactly what to check.

---

# The five rules that keep this safe

1. **The repo stays private.** Check it says Private on GitHub.
2. **Never commit `.env.local`.** Keys live in Vercel's environment variables.
3. **Commit before anything risky.** If it goes wrong: `git restore .` undoes
   uncommitted changes, and Vercel's Instant Rollback undoes a bad deploy.
4. **One piece of work per branch.** "Add the Reader", not "a bunch of stuff".
5. **Keep `DECISIONS.md` in the repo.** One dated line per choice. In two months
   it is the only record of why something works the way it does.

---

# What happens when, roughly

| When | What |
|---|---|
| Evening 1 | Part 1 and Part 2. Node installed, accounts made, feeds proven. |
| Evening 2 | Part 3. Repo, Vercel, a deployed empty site only you can open. |
| Weeks 1 to 2 | Phase 1 of the spec. Follow sources, read, save, archive. |
| Then | Use it daily for a week. Fix what annoys you. Only then start phase 2. |

Everything else on the canvas is specced and waiting. It is not going anywhere.
