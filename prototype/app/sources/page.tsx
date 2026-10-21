"use client";

import { useState } from "react";
import Link from "next/link";
import { isArchived, kindLabel, timeAgo, useStore } from "@/lib/store";
import AddOverlay from "@/components/AddOverlay";
import { Plus } from "@/components/Icons";

export default function SourcesPage() {
  const { ready, store } = useStore();
  const [add, setAdd] = useState(false);
  const [tab, setTab] = useState("all");

  if (!ready) return <div style={{ padding: "48px 0" }} />;

  const tabs = [
    { id: "all", label: "All", f: () => true },
    { id: "blogs", label: "Blogs", f: (k: string) => k === "article" },
    { id: "video", label: "Video", f: (k: string) => k === "video" },
    { id: "podcasts", label: "Podcasts", f: (k: string) => k === "podcast" },
  ];
  const active = tabs.find((t) => t.id === tab) ?? tabs[0];
  const needsAttention = store.sources.filter((s) => s.status === "needs_attention");
  const shown = store.sources.filter((s) => (tab === "all" ? true : active.f(s.kind)));

  return (
    <div className="wrap">
      <div className="columns">
        <main className="main-col" style={{ flex: "1 1 100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", justifyContent: "space-between" }}>
            <h1 className="page">Sources</h1>
            <button className="btn" onClick={() => setAdd(true)}>
              <Plus color="#fff" />
              Add a source
            </button>
          </div>

          <div className="controls">
            <nav className="tabs" aria-label="Show">
              {tabs.map((t) => (
                <button key={t.id} className={tab === t.id ? "on" : undefined} onClick={() => setTab(t.id)}>
                  {t.label}
                </button>
              ))}
              {needsAttention.length > 0 && (
                <button
                  className={tab === "attention" ? "on" : undefined}
                  style={{ color: "var(--attention)", fontWeight: 500 }}
                  onClick={() => setTab("attention")}
                >
                  Needs attention · {needsAttention.length}
                </button>
              )}
            </nav>
          </div>

          {store.sources.length === 0 ? (
            <div className="empty">
              <h2>No sources yet.</h2>
              <p>Paste a link to a blog, a newsletter, a channel or a podcast and it starts filling your Feed.</p>
              <button className="btn" onClick={() => setAdd(true)}>
                <Plus color="#fff" />
                Add your first source
              </button>
            </div>
          ) : (
            <div className="list">
              {(tab === "attention" ? needsAttention : shown).map((s) => {
                const items = store.items.filter((i) => i.sourceId === s.id && !i.deletedAt);
                const newest = items.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))[0];
                const folders = s.folderIds
                  .map((f) => store.folders.find((x) => x.id === f)?.name)
                  .filter(Boolean);
                return (
                  <article className="row" key={s.id}>
                    <span
                      style={{ width: 40, height: 40, borderRadius: 10, background: s.color, flex: "none" }}
                      aria-hidden
                    />
                    <div className="tx">
                      <span style={{ fontSize: 16, fontWeight: 500 }}>{s.title}</span>
                      <span className="meta">
                        <span className="b">{kindLabel[s.kind]}</span>
                        {newest ? `Last post ${timeAgo(newest.publishedAt).toLowerCase()}` : "Nothing yet"}
                        {s.status === "needs_attention" && (
                          <span style={{ color: "var(--attention)", fontWeight: 500 }}>
                            · Not updating, check the link
                          </span>
                        )}
                      </span>
                    </div>
                    {folders[0] && <span className="folder-chip">{folders[0]}</span>}
                    <Link className="lk" href={`/feed/?folder=${s.folderIds[0] ?? ""}`} style={{ flex: "none" }}>
                      View items
                    </Link>
                  </article>
                );
              })}
            </div>
          )}

          <p className="ending">
            {store.sources.length} source{store.sources.length === 1 ? "" : "s"}, checked every 30 minutes.
          </p>
        </main>
      </div>
      {add && <AddOverlay onClose={() => setAdd(false)} />}
    </div>
  );
}
