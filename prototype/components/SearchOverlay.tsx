"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isArchived, isLater, kindLabel, useStore } from "@/lib/store";
import { Search } from "./Icons";

const scopes = ["Everywhere", "Feed", "Library", "Sources"] as const;

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { store, sourceOf } = useStore();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<(typeof scopes)[number]>("Everywhere");
  const router = useRouter();

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const hits = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { items: [], sources: [] };
    const items = store.items
      .filter((i) => !i.deletedAt)
      .filter((i) => {
        if (scope === "Feed") return !isLater(i) && !isArchived(i);
        if (scope === "Library") return isLater(i) || isArchived(i);
        if (scope === "Sources") return false;
        return true;
      })
      .filter(
        (i) =>
          i.title.toLowerCase().includes(term) ||
          i.standfirst.toLowerCase().includes(term) ||
          (sourceOf(i)?.title ?? "").toLowerCase().includes(term)
      )
      .slice(0, 8);
    const sources =
      scope === "Feed" || scope === "Library"
        ? []
        : store.sources.filter((s) => s.title.toLowerCase().includes(term)).slice(0, 4);
    return { items, sources };
  }, [q, scope, store, sourceOf]);

  const mark = (text: string) => {
    const term = q.trim();
    if (!term) return text;
    const i = text.toLowerCase().indexOf(term.toLowerCase());
    if (i < 0) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark style={{ background: "var(--problem)", color: "var(--ink)", padding: "0 2px" }}>
          {text.slice(i, i + term.length)}
        </mark>
        {text.slice(i + term.length)}
      </>
    );
  };

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()} style={{ paddingTop: "12vh" }}>
      <div
        role="dialog"
        aria-label="Search"
        aria-modal
        style={{
          width: "100%",
          maxWidth: 720,
          background: "var(--card)",
          borderRadius: "var(--r-24)",
          boxShadow: "var(--shadow-menu)",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 24px", borderBottom: "1px solid var(--divider)" }}>
          <Search size={20} color="var(--ink-muted)" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search everything you follow"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 20,
              fontFamily: "var(--font-sans), sans-serif",
              color: "var(--ink)",
              background: "transparent",
            }}
          />
          <span style={{ fontSize: 12, color: "var(--ink-muted)", border: "1px solid var(--divider)", borderRadius: 6, padding: "2px 6px" }}>
            esc
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, padding: "12px 24px", flexWrap: "wrap", borderBottom: "1px solid var(--divider)" }}>
          {scopes.map((s) => (
            <button key={s} className={scope === s ? "chip on" : "chip"} onClick={() => setScope(s)}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ maxHeight: "50vh", overflowY: "auto", padding: "8px 12px 16px" }}>
          {!q.trim() && (
            <p style={{ margin: 0, padding: "24px 12px", color: "var(--ink-muted)", fontSize: 15 }}>
              Type to search titles, descriptions and source names.
            </p>
          )}
          {q.trim() && hits.items.length === 0 && hits.sources.length === 0 && (
            <p style={{ margin: 0, padding: "24px 12px", color: "var(--ink-muted)", fontSize: 15 }}>
              Nothing matches “{q.trim()}”. Try fewer words.
            </p>
          )}
          {hits.items.map((i) => (
            <button
              key={i.id}
              className="mi"
              style={{ width: "100%", alignItems: "flex-start", padding: "12px", minHeight: 56 }}
              onClick={() => {
                onClose();
                router.push(`/read/?id=${i.id}`);
              }}
            >
              <span
                style={{
                  width: 56,
                  aspectRatio: "16 / 9",
                  borderRadius: 8,
                  background: sourceOf(i)?.color ?? "var(--media-4)",
                  flex: "none",
                }}
              />
              <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span className="serif" style={{ fontSize: 17, lineHeight: 1.3 }}>
                  {mark(i.title)}
                </span>
                <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>
                  {kindLabel[i.kind]} · {sourceOf(i)?.title} · {i.minutes} min
                </span>
              </span>
            </button>
          ))}
          {hits.sources.map((s) => (
            <button
              key={s.id}
              className="mi"
              onClick={() => {
                onClose();
                router.push("/sources/");
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 999, background: s.color, flex: "none" }} />
              <span style={{ fontSize: 15 }}>{mark(s.title)}</span>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-muted)" }}>Source</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
