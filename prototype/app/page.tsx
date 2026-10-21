"use client";

import Link from "next/link";
import { isLater, isUnseen, useStore } from "@/lib/store";
import { Arrow } from "@/components/Icons";

export default function Home() {
  const { ready, store } = useStore();
  if (!ready) return <div className="wrap" style={{ padding: "48px 32px" }} />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning." : hour < 18 ? "Good afternoon." : "Good evening.";
  const live = store.items.filter((i) => !i.deletedAt);
  const unseen = live.filter(isUnseen);
  const later = live.filter(isLater);
  const minutes = unseen.reduce((n, i) => n + i.minutes, 0);

  // Day one
  if (store.sources.length === 0) {
    return (
      <div className="wrap">
        <main className="main-col" style={{ padding: "32px 0 96px", gap: 28 }}>
          <h1 className="display">
            {greeting}
            <br />
            <span className="accent">Let&apos;s add some content.</span>
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: "var(--ink-muted)", maxWidth: "60ch", lineHeight: 1.6 }}>
            Home builds itself from what you follow. Three small steps and it comes alive.
          </p>
          <section>
            {[
              ["Pick a few topics", "Folders you can sort things into later", "/sources"],
              ["Follow your first 3 sources", "Paste a link: a blog, a channel, a podcast", "/sources"],
              ["Save one thing for later", "Anything you have been meaning to read", "/library"],
            ].map(([title, sub, href], n) => (
              <Link
                key={title}
                href={href}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  padding: "24px 0",
                  borderTop: n === 0 ? "2px solid var(--divider)" : "1px solid var(--divider)",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    flex: "none",
                    background: "var(--softer)",
                    color: "var(--action)",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {n + 1}
                </span>
                <span style={{ flex: 1 }}>
                  <span className="serif" style={{ fontSize: 22 }}>
                    {title}
                    <Arrow />
                  </span>
                  <br />
                  <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>{sub}</span>
                </span>
              </Link>
            ))}
          </section>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-muted)" }}>
            Prototype note: Settings has a control that fills this with sample content.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="wrap">
      <main className="main-col" style={{ padding: "32px 0 96px", gap: 32 }}>
        <h1 className="display">
          {greeting}
          <br />
          <span className="accent">{unseen.length ? "Here's what's new." : "You're all caught up."}</span>
        </h1>

        {unseen.length > 0 ? (
          <div className="card" style={{ background: "var(--card)", gap: 16 }}>
            <p className="lbl" style={{ color: "var(--ink-muted)" }}>
              Today
            </p>
            <p className="serif" style={{ margin: 0, fontSize: 28, lineHeight: 1.25 }}>
              {minutes} minutes of reading, watching and listening is waiting.
            </p>
            <p style={{ margin: 0, fontSize: 15, color: "var(--ink-body)", lineHeight: 1.6 }}>
              Nothing here expires. Read one thing or read none.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <Link className="btn" href="/feed">
                Open the Feed
              </Link>
              {later.length > 0 && (
                <Link className="btn soft" href="/library">
                  Open Later
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="card">
            <h2 className="serif" style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>
              You&apos;re all caught up.
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: "var(--ink-body)", lineHeight: 1.6 }}>
              Nothing new since you last looked. We&apos;ll check again in about 30 minutes, so go enjoy
              your day.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {later.length > 0 && (
                <Link className="btn" href="/library">
                  Open Later
                </Link>
              )}
              <Link className="btn soft" href="/feed">
                Browse seen
              </Link>
            </div>
          </div>
        )}

        <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="group-head">
            <h2 className="lbl">Your folders</h2>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {store.folders.map((f) => {
              const count = unseen.filter((i) => {
                const src = store.sources.find((s) => s.id === i.sourceId);
                return src?.folderIds.includes(f.id);
              }).length;
              return (
                <Link
                  key={f.id}
                  href={`/feed/?folder=${f.id}`}
                  style={{
                    flex: "1 1 200px",
                    background: "var(--card)",
                    borderRadius: "var(--r-20)",
                    padding: 20,
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <span className="serif" style={{ fontSize: 22 }}>
                    {f.name}
                  </span>
                  <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>
                    {count === 0 ? "Nothing new" : `${count} to look at`}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
