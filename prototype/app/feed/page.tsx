"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ListView from "@/components/ListView";
import { isArchived, isLater, isSeen, isUnseen, useStore } from "@/lib/store";
import { Plus } from "@/components/Icons";

function FeedInner() {
  const { ready, store } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const folderId = params.get("folder");
  const folder = store.folders.find((f) => f.id === folderId);

  if (!ready) return <div style={{ padding: "48px 0" }} />;

  const inFolder = (sourceId: string) => {
    if (!folderId) return true;
    const src = store.sources.find((s) => s.id === sourceId);
    return Boolean(src?.folderIds.includes(folderId));
  };

  const items = store.items.filter((i) => !i.deletedAt && !isArchived(i) && inFolder(i.sourceId));

  return (
    <div className="wrap">
      <div className="columns">
        <aside className="side-col">
          <nav className="side" aria-label="All items">
            <Link href="/feed/" className={!folderId ? "on" : undefined}>
              Everything
            </Link>
          </nav>
          <nav className="side" aria-label="Folders">
            <div className="sh">
              <h2 className="lbl">Folders</h2>
            </div>
            {store.folders.map((f) => (
              <Link key={f.id} href={`/feed/?folder=${f.id}`} className={folderId === f.id ? "on" : undefined}>
                {f.name}
              </Link>
            ))}
          </nav>
          <nav className="side" aria-label="Sources">
            <div className="sh">
              <h2 className="lbl">Sources</h2>
              <Link href="/sources/" className="lk" style={{ color: "var(--attention)" }}>
                Manage
              </Link>
            </div>
            {store.sources.slice(0, 6).map((s) => (
              <Link key={s.id} href="/sources/">
                <span
                  style={{ width: 20, height: 20, borderRadius: 6, background: s.color, flex: "none" }}
                  aria-hidden
                />
                {s.title}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="main-col">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              {folder && (
                <p className="lbl" style={{ color: "var(--ink-muted)" }}>
                  Feed · folder
                </p>
              )}
              <h1 className="page" style={{ marginTop: folder ? 6 : 0 }}>
                {folder ? folder.name : "Feed"}
              </h1>
            </div>
          </div>

          <ListView
            prefsKey={folderId ? `feed-${folderId}` : "feed"}
            items={items}
            tabs={[
              { id: "unseen", label: "Unseen", filter: isUnseen },
              { id: "seen", label: "Seen", filter: isSeen },
              { id: "all", label: "All", filter: () => true },
            ]}
            groupOptions={["Date", "None", "Source", "Folder", "Type"]}
            ending={(n, tab) =>
              tab === "Unseen"
                ? `That's all ${n} unseen${folder ? ` in ${folder.name}` : ""}. You're caught up.`
                : `That's ${n} item${n === 1 ? "" : "s"}${folder ? ` in ${folder.name}` : ""}.`
            }
            empty={
              store.sources.length === 0 ? (
                <div className="empty">
                  <h2>Nothing to read yet.</h2>
                  <p>Follow a source and whatever it publishes shows up here.</p>
                  <button className="btn" onClick={() => router.push("/sources/")}>
                    <Plus color="#fff" />
                    Add a source
                  </button>
                </div>
              ) : (
                <div className="empty">
                  <h2>You&apos;re all caught up.</h2>
                  <p>
                    Nothing new since you last looked. We&apos;ll check again in about 30 minutes, so go
                    enjoy your day.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    <Link className="btn" href="/library/">
                      Open Later
                    </Link>
                  </div>
                </div>
              )
            }
          />
        </main>
      </div>
    </div>
  );
}

export default function FeedPage() {
  return (
    <Suspense fallback={<div style={{ padding: "48px 0" }} />}>
      <FeedInner />
    </Suspense>
  );
}
