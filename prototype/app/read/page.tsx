"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { kindLabel, timeAgo, useStore } from "@/lib/store";
import { Back, Box, Clock, External, Trash } from "@/components/Icons";

function ReaderInner() {
  const { ready, store, sourceOf, setState } = useStore();
  const params = useSearchParams();
  const router = useRouter();
  const id = params.get("id");
  const item = store.items.find((i) => i.id === id);
  const [size, setSize] = useState(20);
  const [note, setNote] = useState<string | null>(null);

  // opening something marks it seen, which is how a reader should behave
  useEffect(() => {
    if (item && !item.seenAt) setState(item.id, { seenAt: new Date().toISOString() });
  }, [item, setState]);

  if (!ready) return <div style={{ padding: "48px 0" }} />;

  if (!item) {
    return (
      <div className="reader">
        <h1>That item isn&apos;t here.</h1>
        <p className="standfirst">It may have been deleted, or the demo data was reset.</p>
        <p style={{ marginTop: 24 }}>
          <Link className="btn" href="/feed/">
            Back to the Feed
          </Link>
        </p>
      </div>
    );
  }

  const source = sourceOf(item);

  const act = (verb: string, patch: Parameters<typeof setState>[1]) => {
    setState(item.id, patch);
    setNote(verb);
  };

  return (
    <>
      <div className="reader-bar">
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "8px 24px",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button className="lk" onClick={() => router.back()} style={{ display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44 }}>
            <Back /> Back
          </button>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="ib"
              aria-label="Text size"
              title="Text size"
              style={{ background: "transparent", fontFamily: "var(--font-serif)", fontSize: 16, fontWeight: 500 }}
              onClick={() => setSize((s) => (s >= 24 ? 18 : s + 2))}
            >
              Aa
            </button>
            <button
              className="btn ghost"
              style={{ height: 40 }}
              onClick={() =>
                item.savedAt
                  ? act("Removed from Later", { savedAt: null })
                  : act("Saved to Later", { savedAt: new Date().toISOString() })
              }
            >
              <Clock /> {item.savedAt ? "In Later" : "Later"}
            </button>
            <button
              className="btn ghost"
              style={{ height: 40 }}
              onClick={() => {
                act("Archived", { archivedAt: new Date().toISOString() });
                setTimeout(() => router.push("/feed/"), 450);
              }}
            >
              <Box /> Archive
            </button>
            <button
              className="ib"
              aria-label="Delete"
              title="Delete"
              style={{ background: "transparent" }}
              onClick={() => {
                act("Deleted", { deletedAt: new Date().toISOString() });
                setTimeout(() => router.push("/feed/"), 450);
              }}
            >
              <Trash />
            </button>
            <span className="ib" aria-hidden style={{ background: "transparent" }}>
              <External />
            </span>
          </div>
        </div>
        <div style={{ height: 3, background: "var(--control)" }}>
          <div style={{ width: "34%", height: 3, background: "var(--attention)" }} />
        </div>
      </div>

      <article className="reader">
        {note && (
          <p className="confirm" style={{ borderTop: "none", paddingTop: 0, marginTop: 0 }}>
            {note}.
          </p>
        )}
        <div className="meta" style={{ marginBottom: 16 }}>
          <span style={{ width: 24, height: 24, borderRadius: 6, background: source?.color, flex: "none" }} aria-hidden />
          <span style={{ fontWeight: 600, color: "var(--ink)" }}>{source?.title}</span>
          <span>·</span>
          <span>{timeAgo(item.publishedAt)}</span>
          <span>·</span>
          <span>{item.minutes} min</span>
          <span className="b">{kindLabel[item.kind]}</span>
        </div>
        <h1>{item.title}</h1>
        <p className="standfirst">{item.standfirst}</p>
        <div
          style={{
            aspectRatio: "16 / 9",
            background: source?.color ?? "var(--media-6)",
            borderRadius: "var(--r-20)",
            marginTop: 24,
          }}
        />
        <div className="body-copy" style={{ fontSize: size }}>
          {item.body.map((p, n) => (
            <p key={n}>{p}</p>
          ))}
        </div>
        <p className="ending" style={{ marginTop: 48 }}>
          The end. Nothing else is queued up after this.
        </p>
      </article>
    </>
  );
}

export default function ReadPage() {
  return (
    <Suspense fallback={<div style={{ padding: "48px 0" }} />}>
      <ReaderInner />
    </Suspense>
  );
}
