"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Item } from "@/lib/types";
import { kindLabel, timeAgo, useStore } from "@/lib/store";
import { Box, Clock, Dots, Eye, Play, Trash } from "./Icons";

type Props = {
  item: Item;
  onAct: (verb: string, item: Item, undo: () => void) => void;
};

export default function ItemRow({ item, onAct }: Props) {
  const { sourceOf, foldersOf, setState } = useStore();
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const source = sourceOf(item);
  const folders = foldersOf(item);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setMenu(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const act = (verb: string, patch: Partial<Item>) => {
    const before: Partial<Item> = {
      seenAt: item.seenAt,
      savedAt: item.savedAt,
      archivedAt: item.archivedAt,
      deletedAt: item.deletedAt,
    };
    setState(item.id, patch);
    setMenu(false);
    onAct(verb, item, () => setState(item.id, before));
  };

  const badge = item.kind === "video" ? "b video" : item.kind === "podcast" ? "b podcast" : "b";

  return (
    <article className="row" ref={wrap}>
      <span className={item.seenAt ? "dot off" : "dot"}>
        <span style={{ position: "absolute", left: -9999 }}>{item.seenAt ? "" : "New"}</span>
      </span>
      <div className="th" style={{ background: source?.color ?? "var(--media-4)" }}>
        {(item.kind === "video" || item.kind === "podcast") && <Play size={22} color="#ffffff" />}
      </div>
      <div className="tx">
        <button className="tt" onClick={() => router.push(`/read/?id=${item.id}`)}>
          {item.title}
        </button>
        <span className="meta">
          <span className={badge}>{kindLabel[item.kind]}</span>
          {source?.title} · {item.minutes} min · {timeAgo(item.publishedAt)}
        </span>
      </div>
      {folders[0] && <span className="folder-chip">{folders[0]}</span>}
      <div className="acts">
        <button
          className="act"
          aria-label={item.savedAt ? "Remove from Later" : "Save to Later"}
          title={item.savedAt ? "Remove from Later" : "Save to Later"}
          onClick={() =>
            item.savedAt
              ? act("Removed from Later", { savedAt: null })
              : act("Saved to Later", { savedAt: new Date().toISOString() })
          }
        >
          <Clock />
        </button>
        <button
          className="act"
          aria-label="Archive"
          title="Archive"
          onClick={() => act("Archived", { archivedAt: new Date().toISOString(), seenAt: item.seenAt ?? new Date().toISOString() })}
        >
          <Box />
        </button>
        <button
          className="act"
          aria-label={item.seenAt ? "Mark as unseen" : "Mark as seen"}
          title={item.seenAt ? "Mark as unseen" : "Mark as seen"}
          onClick={() =>
            item.seenAt
              ? act("Marked as unseen", { seenAt: null })
              : act("Marked as seen", { seenAt: new Date().toISOString() })
          }
        >
          <Eye />
        </button>
      </div>
      <button className="more" aria-label="More actions" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
        <Dots />
      </button>
      {menu && (
        <div className="menu" role="menu" aria-label="Item actions">
          <button className="mi" onClick={() => router.push(`/read/?id=${item.id}`)}>
            <Eye /> Open
          </button>
          <button className="mi" onClick={() => act("Saved to Later", { savedAt: new Date().toISOString() })}>
            <Clock /> Save to Later
          </button>
          <button
            className="mi"
            onClick={() => act("Archived", { archivedAt: new Date().toISOString(), seenAt: item.seenAt ?? new Date().toISOString() })}
          >
            <Box /> Archive
          </button>
          <div className="sep" />
          <button className="mi danger" onClick={() => act("Deleted", { deletedAt: new Date().toISOString() })}>
            <Trash /> Delete
          </button>
        </div>
      )}
    </article>
  );
}
