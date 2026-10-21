"use client";

import Link from "next/link";
import ListView from "@/components/ListView";
import { isArchived, useStore } from "@/lib/store";
import { LibraryShell } from "../page";

export default function ArchivePage() {
  const { ready, store } = useStore();
  if (!ready) return <div style={{ padding: "48px 0" }} />;
  const items = store.items.filter((i) => !i.deletedAt && isArchived(i));

  return (
    <LibraryShell heading="Archive">
      <ListView
        prefsKey="archive"
        items={items}
        tabs={[
          { id: "all", label: "All", filter: () => true },
          { id: "read", label: "Read", filter: (i) => i.kind === "article" || i.kind === "discussion" },
          { id: "watch", label: "Watched", filter: (i) => i.kind === "video" },
          { id: "listen", label: "Listened", filter: (i) => i.kind === "podcast" },
        ]}
        groupOptions={["None", "Folder", "Type", "Date"]}
        sortOptions={["Recently archived", "Newest first", "Oldest first", "Source A to Z"]}
        ending={(n) => `${n} item${n === 1 ? "" : "s"} kept. Nothing here needs your attention.`}
        empty={
          <div className="empty">
            <h2>The archive is empty.</h2>
            <p>Archiving keeps something without leaving it on a pile. Use the box button on any row.</p>
            <Link className="btn" href="/feed/">
              Open the Feed
            </Link>
          </div>
        }
      />
    </LibraryShell>
  );
}
