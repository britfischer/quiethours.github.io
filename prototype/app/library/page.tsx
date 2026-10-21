"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ListView from "@/components/ListView";
import { isArchived, isLater, useStore } from "@/lib/store";

export function LibraryShell({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading: string;
}) {
  const path = usePathname() || "";
  const shelves = [
    { href: "/library/", label: "Later" },
    { href: "/library/archive/", label: "Archive" },
  ];
  return (
    <div className="wrap">
      <div className="columns">
        <aside className="side-col">
          <nav className="side" aria-label="Shelves">
            <div className="sh">
              <h2 className="lbl">Shelves</h2>
            </div>
            {shelves.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={path === s.href || path === s.href.slice(0, -1) ? "on" : undefined}
              >
                {s.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="main-col">
          <h1 className="page">{heading}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function LaterPage() {
  const { ready, store } = useStore();
  if (!ready) return <div style={{ padding: "48px 0" }} />;
  const items = store.items.filter((i) => !i.deletedAt && isLater(i));

  return (
    <LibraryShell heading="Later">
      <ListView
        prefsKey="later"
        items={items}
        tabs={[
          { id: "all", label: "All", filter: () => true },
          { id: "read", label: "Read", filter: (i) => i.kind === "article" || i.kind === "discussion" },
          { id: "watch", label: "Watch", filter: (i) => i.kind === "video" },
          { id: "listen", label: "Listen", filter: (i) => i.kind === "podcast" },
        ]}
        groupOptions={["None", "Folder", "Type", "Date"]}
        sortOptions={["Recently saved", "Newest first", "Oldest first", "Shortest first", "Source A to Z"]}
        ending={(n) => `That's your whole Later shelf, ${n} item${n === 1 ? "" : "s"}.`}
        empty={
          <div className="empty">
            <h2>Nothing saved for later.</h2>
            <p>Save something from the Feed with the clock button on a row and it waits here.</p>
            <Link className="btn" href="/feed/">
              Open the Feed
            </Link>
          </div>
        }
      />
    </LibraryShell>
  );
}
