"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Close } from "./Icons";

export default function AddOverlay({ onClose }: { onClose: () => void }) {
  const { store, addSource } = useStore();
  const [url, setUrl] = useState("");
  const [folder, setFolder] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [onClose]);

  const submit = () => {
    const clean = url.trim();
    if (!clean) {
      setError("Paste a link first.");
      return;
    }
    if (!/\./.test(clean)) {
      setError("That doesn't look like a link. Try something like fieldnotes.example or a YouTube channel.");
      return;
    }
    if (store.sources.some((s) => clean.includes(s.site))) {
      setError("You already follow this one. It's in your Sources list.");
      return;
    }
    addSource(clean, folder || null);
    onClose();
    router.push("/feed/");
  };

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-label="Add something" aria-modal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div>
            <p className="lbl" style={{ color: "var(--ink-muted)" }}>
              Add
            </p>
            <h2 className="page serif" style={{ margin: "6px 0 0", fontSize: 28 }}>
              Follow something new
            </h2>
          </div>
          <button className="ib" aria-label="Close" onClick={onClose} style={{ background: "var(--soft)" }}>
            <Close />
          </button>
        </div>

        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink-body)" }}>
          Paste a blog, a newsletter, a YouTube channel, a podcast or a subreddit. A feed link works
          too. In the finished app this resolves the feed and pulls in real posts.
        </p>

        <label className="stack">
          Link
          <input
            className="field"
            autoFocus
            placeholder="fieldnotes.example"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </label>

        {store.folders.length > 0 && (
          <label className="stack">
            Folder
            <select className="field" value={folder} onChange={(e) => setFolder(e.target.value)}>
              <option value="">No folder</option>
              {store.folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && (
          <p
            style={{
              margin: 0,
              background: "var(--problem)",
              borderRadius: "var(--r-12)",
              padding: "12px 16px",
              fontSize: 14,
              color: "var(--attention-deep)",
            }}
            role="alert"
          >
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn soft" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={submit}>
            Follow
          </button>
        </div>
      </div>
    </div>
  );
}
