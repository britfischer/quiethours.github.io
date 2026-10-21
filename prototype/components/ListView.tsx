"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Item } from "@/lib/types";
import { dayGroup, useStore } from "@/lib/store";
import ItemRow from "./ItemRow";
import { Check, Filter as FilterIcon } from "./Icons";

export type Tab = { id: string; label: string; filter: (i: Item) => boolean };

type Props = {
  prefsKey: string;
  tabs: Tab[];
  items: Item[];
  groupOptions?: string[];
  sortOptions?: string[];
  ending: (count: number, tab: string) => string;
  empty: React.ReactNode;
  showFolderFilter?: boolean;
};

type Prefs = { tab: string; group: string; sort: string };

export default function ListView({
  prefsKey,
  tabs,
  items,
  groupOptions = ["None", "Date", "Source", "Folder", "Type"],
  sortOptions = ["Newest first", "Oldest first", "Shortest first", "Source A to Z"],
  ending,
  empty,
  showFolderFilter = true,
}: Props) {
  const { store, sourceOf } = useStore();
  const [prefs, setPrefs] = useState<Prefs>({ tab: tabs[0].id, group: groupOptions[0], sort: sortOptions[0] });
  const [filterOpen, setFilterOpen] = useState(false);
  const [kinds, setKinds] = useState<string[]>([]);
  const [folder, setFolder] = useState<string>("Any");
  const [length, setLength] = useState<string>("Any");
  const [note, setNote] = useState<{ text: string; undo: () => void } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  // remember the last choice per page
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(`prefs-${prefsKey}`);
      if (raw) setPrefs({ ...JSON.parse(raw) });
    } catch {}
  }, [prefsKey]);
  useEffect(() => {
    try {
      window.localStorage.setItem(`prefs-${prefsKey}`, JSON.stringify(prefs));
    } catch {}
  }, [prefs, prefsKey]);

  useEffect(() => {
    if (!filterOpen) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setFilterOpen(false);
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [filterOpen]);

  const tab = tabs.find((t) => t.id === prefs.tab) ?? tabs[0];

  const shown = useMemo(() => {
    let list = items.filter(tab.filter);
    if (kinds.length) list = list.filter((i) => kinds.includes(i.kind));
    if (folder !== "Any") {
      list = list.filter((i) => {
        const src = sourceOf(i);
        if (folder === "No folder") return !src || src.folderIds.length === 0;
        const f = store.folders.find((x) => x.name === folder);
        return Boolean(f && src?.folderIds.includes(f.id));
      });
    }
    if (length === "Under 5 min") list = list.filter((i) => i.minutes < 5);
    if (length === "5 to 15") list = list.filter((i) => i.minutes >= 5 && i.minutes <= 15);
    if (length === "Longer") list = list.filter((i) => i.minutes > 15);

    const by = {
      "Newest first": (a: Item, b: Item) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
      "Oldest first": (a: Item, b: Item) => +new Date(a.publishedAt) - +new Date(b.publishedAt),
      "Shortest first": (a: Item, b: Item) => a.minutes - b.minutes,
      "Source A to Z": (a: Item, b: Item) =>
        (sourceOf(a)?.title ?? "").localeCompare(sourceOf(b)?.title ?? ""),
      "Recently saved": (a: Item, b: Item) => +new Date(b.savedAt ?? 0) - +new Date(a.savedAt ?? 0),
      "Recently archived": (a: Item, b: Item) => +new Date(b.archivedAt ?? 0) - +new Date(a.archivedAt ?? 0),
    } as Record<string, (a: Item, b: Item) => number>;
    return [...list].sort(by[prefs.sort] ?? by["Newest first"]);
  }, [items, tab, kinds, folder, length, prefs.sort, sourceOf, store.folders]);

  const groups = useMemo(() => {
    if (prefs.group === "None") return [["", shown] as const];
    const map = new Map<string, Item[]>();
    for (const i of shown) {
      let key = "";
      if (prefs.group === "Date") key = dayGroup(i.publishedAt);
      else if (prefs.group === "Source") key = sourceOf(i)?.title ?? "Unknown";
      else if (prefs.group === "Type") key = i.kind;
      else if (prefs.group === "Folder") {
        const src = sourceOf(i);
        key = src?.folderIds.map((f) => store.folders.find((x) => x.id === f)?.name).filter(Boolean)[0] ?? "No folder";
      }
      map.set(key, [...(map.get(key) ?? []), i]);
    }
    return [...map.entries()];
  }, [shown, prefs.group, sourceOf, store.folders]);

  const filterCount = kinds.length + (folder !== "Any" ? 1 : 0) + (length !== "Any" ? 1 : 0);

  const onAct = (verb: string, item: Item, undo: () => void) => {
    setNote({ text: `${verb}: ${item.title}`, undo });
  };

  return (
    <>
      <div className="controls">
        <nav className="tabs" aria-label="Show">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={t.id === prefs.tab ? "on" : undefined}
              aria-current={t.id === prefs.tab}
              onClick={() => setPrefs((p) => ({ ...p, tab: t.id }))}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <label className="ctl">
            Group by
            <select value={prefs.group} onChange={(e) => setPrefs((p) => ({ ...p, group: e.target.value }))}>
              {groupOptions.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <span className="vr" />
          <label className="ctl">
            Sort
            <select value={prefs.sort} onChange={(e) => setPrefs((p) => ({ ...p, sort: e.target.value }))}>
              {sortOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <span className="vr" />
          <button
            className={filterOpen || filterCount ? "filter-btn on" : "filter-btn"}
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((f) => !f)}
          >
            <FilterIcon color="var(--action)" />
            Filter{filterCount ? ` · ${filterCount}` : ""}
          </button>
        </div>

        {filterOpen && (
          <div className="panel" role="dialog" aria-label="Filter" ref={panel}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="lbl">Filter</span>
              <button
                className="lk"
                onClick={() => {
                  setKinds([]);
                  setFolder("Any");
                  setLength("Any");
                }}
              >
                Clear all
              </button>
            </div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Type</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {[
                  ["article", "Read"],
                  ["video", "Watch"],
                  ["podcast", "Listen"],
                  ["discussion", "Discussion"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    className={kinds.includes(id) ? "chip on" : "chip"}
                    onClick={() =>
                      setKinds((k) => (k.includes(id) ? k.filter((x) => x !== id) : [...k, id]))
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {showFolderFilter && (
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Folder</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["Any", ...store.folders.map((f) => f.name), "No folder"].map((f) => (
                    <button key={f} className={folder === f ? "chip on" : "chip"} onClick={() => setFolder(f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Length</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["Any", "Under 5 min", "5 to 15", "Longer"].map((l) => (
                  <button key={l} className={length === l ? "chip on" : "chip"} onClick={() => setLength(l)}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {note && (
        <div className="confirm" role="status">
          <Check color="var(--action)" />
          <span style={{ flex: 1 }}>{note.text}</span>
          <button
            className="undo"
            onClick={() => {
              note.undo();
              setNote(null);
            }}
          >
            Undo
          </button>
          <button className="lk" onClick={() => setNote(null)} aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      {shown.length === 0 ? (
        empty
      ) : (
        <>
          {groups.map(([key, list]) => (
            <section key={key || "all"} style={{ display: "flex", flexDirection: "column" }}>
              {key && (
                <div className="group-head">
                  <h2 className="lbl">{key}</h2>
                </div>
              )}
              <div className="list" style={key ? undefined : { borderTop: "2px solid var(--divider)" }}>
                {list.map((i) => (
                  <ItemRow key={i.id} item={i} onAct={onAct} />
                ))}
              </div>
            </section>
          ))}
          <p className="ending">{ending(shown.length, tab.label)}</p>
        </>
      )}
    </>
  );
}
