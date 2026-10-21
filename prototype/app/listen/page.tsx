"use client";

import Link from "next/link";
import ListView from "@/components/ListView";
import { isArchived, useStore } from "@/lib/store";

export default function ListenPage() {
  const { ready, store } = useStore();
  if (!ready) return <div style={{ padding: "48px 0" }} />;

  const items = store.items.filter(
    (i) => !i.deletedAt && !isArchived(i) && (i.kind === "podcast" || i.kind === "video")
  );

  return (
    <div className="wrap">
      <div className="columns">
        <main className="main-col" style={{ flex: "1 1 100%" }}>
          <h1 className="page">Listen &amp; watch</h1>

          <ListView
            prefsKey="listen"
            items={items}
            tabs={[
              { id: "all", label: "All", filter: () => true },
              { id: "podcasts", label: "Podcasts", filter: (i) => i.kind === "podcast" },
              { id: "videos", label: "Videos", filter: (i) => i.kind === "video" },
            ]}
            groupOptions={["None", "Type", "Source", "Date"]}
            sortOptions={["Newest first", "Oldest first", "Shortest first", "Source A to Z"]}
            ending={(n) => `${n} thing${n === 1 ? "" : "s"} to watch or listen to. Playback lands in phase 3.`}
            empty={
              <div className="empty">
                <h2>Nothing to play.</h2>
                <p>Follow a podcast or a video channel and new episodes collect here.</p>
                <Link className="btn" href="/sources/">
                  Add a source
                </Link>
              </div>
            }
          />

          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-muted)" }}>
            Prototype note: the player itself is phase 3. Opening an item here shows its page, the same
            as reading.
          </p>
        </main>
      </div>
    </div>
  );
}
