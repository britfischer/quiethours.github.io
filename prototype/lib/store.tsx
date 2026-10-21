"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Item, Source, Store } from "./types";
import { emptyStore, makeSeed } from "./seed";

const KEY = "quiet-hours-prototype-v1";

/** One module behind every read and write. Swap this for Supabase later. */
type Ctx = {
  ready: boolean;
  store: Store;
  sourceOf: (item: Item) => Source | undefined;
  foldersOf: (item: Item) => string[];
  setState: (id: string, patch: Partial<Item>) => void;
  addSource: (url: string, folderId: string | null) => string;
  reseed: (mode: "demo" | "empty") => void;
  setSetting: (key: keyof Store["settings"], value: boolean) => void;
};

const StoreContext = createContext<Ctx | null>(null);

function load(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    /* private window, blocked storage: fall through to a seed */
  }
  return makeSeed();
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(emptyStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(store));
    } catch {
      /* storage can be unavailable; the prototype still works in memory */
    }
  }, [store, ready]);

  const setState = useCallback((id: string, patch: Partial<Item>) => {
    setStore((s) => ({ ...s, items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  }, []);

  const addSource = useCallback((url: string, folderId: string | null) => {
    const host = url.replace(/^https?:\/\//, "").split("/")[0] || "example.com";
    const name = host
      .replace(/^www\./, "")
      .split(".")[0]
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const id = `src-${Date.now()}`;
    const colors = ["#dcd7e4", "#e8d6c8", "#cdcaa6", "#e2ded2", "#dcdac0"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const now = Date.now();
    const newItems: Item[] = [0, 1, 2].map((n) => ({
      id: `${id}-item-${n}`,
      sourceId: id,
      title: [`Welcome to ${name}`, `${name}: the most recent post`, `${name}: something from last week`][n],
      standfirst: "Pulled in when you followed this source.",
      body: [
        `This is a stand-in for a real post from ${name}.`,
        `In the finished version the text comes from the source's feed, cleaned up for reading.`,
      ],
      kind: "article",
      minutes: 4 + n * 2,
      publishedAt: new Date(now - (n + 1) * 5 * 3600_000).toISOString(),
      seenAt: null,
      savedAt: null,
      archivedAt: null,
      deletedAt: null,
    }));
    setStore((s) => ({
      ...s,
      sources: [
        ...s.sources,
        { id, title: name, kind: "article", site: host, color, status: "ok", folderIds: folderId ? [folderId] : [] },
      ],
      items: [...newItems, ...s.items],
    }));
    return id;
  }, []);

  const reseed = useCallback((mode: "demo" | "empty") => {
    setStore(mode === "demo" ? makeSeed() : emptyStore());
  }, []);

  const setSetting = useCallback((key: keyof Store["settings"], value: boolean) => {
    setStore((s) => ({ ...s, settings: { ...s.settings, [key]: value } }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      store,
      sourceOf: (item) => store.sources.find((s) => s.id === item.sourceId),
      foldersOf: (item) => {
        const src = store.sources.find((s) => s.id === item.sourceId);
        if (!src) return [];
        return src.folderIds
          .map((fid) => store.folders.find((f) => f.id === fid)?.name)
          .filter((n): n is string => Boolean(n));
      },
      setState,
      addSource,
      reseed,
      setSetting,
    }),
    [ready, store, setState, addSource, reseed, setSetting]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* ---------- shared helpers ---------- */

export function isUnseen(i: Item) {
  return !i.seenAt && !i.archivedAt && !i.deletedAt;
}
export function isSeen(i: Item) {
  return Boolean(i.seenAt) && !i.archivedAt && !i.deletedAt;
}
export function isLater(i: Item) {
  return Boolean(i.savedAt) && !i.archivedAt && !i.deletedAt;
}
export function isArchived(i: Item) {
  return Boolean(i.archivedAt) && !i.deletedAt;
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.round(diff / 3600_000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  const w = Math.round(d / 7);
  return `${w} week${w === 1 ? "" : "s"} ago`;
}

export function dayGroup(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return d.getHours() < 12 ? "This morning" : "Today";
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  const days = Math.round((now.getTime() - d.getTime()) / 86400_000);
  if (days < 7) return "Earlier this week";
  if (days < 30) return "Earlier this month";
  return "Older";
}

export const kindLabel: Record<Item["kind"], string> = {
  article: "Article",
  video: "Video",
  podcast: "Podcast",
  discussion: "Discussion",
};
