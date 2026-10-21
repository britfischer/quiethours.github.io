"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function SettingsPage() {
  const { ready, store, setSetting, reseed } = useStore();
  const [done, setDone] = useState<string | null>(null);
  const router = useRouter();
  if (!ready) return <div style={{ padding: "48px 0" }} />;

  const toggles: { key: keyof typeof store.settings; label: string; hint: string }[] = [
    {
      key: "markSeenOnScroll",
      label: "Mark as seen when I scroll past",
      hint: "Off means items stay new until you open or clear them",
    },
    { key: "showCounts", label: "Show unread counts", hint: "Off by default, and worth leaving off" },
    { key: "openOriginal", label: "Open the original site instead of the reading view", hint: "Only for sources that need it" },
  ];

  return (
    <div className="wrap">
      <div className="columns">
        <main className="main-col" style={{ flex: "1 1 100%", maxWidth: 720 }}>
          <h1 className="page">Settings</h1>

          <section style={{ display: "flex", flexDirection: "column" }}>
            <div className="group-head">
              <h2 className="lbl">Reading</h2>
            </div>
            {toggles.map((t) => (
              <label
                key={t.key}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 64,
                  borderBottom: "1px solid var(--divider)",
                  cursor: "pointer",
                }}
              >
                <span>
                  <b style={{ fontWeight: 600 }}>{t.label}</b>
                  <br />
                  <span style={{ fontSize: 14, color: "var(--ink-muted)" }}>{t.hint}</span>
                </span>
                <input
                  type="checkbox"
                  checked={store.settings[t.key]}
                  onChange={(e) => setSetting(t.key, e.target.checked)}
                  style={{ width: 20, height: 20, accentColor: "var(--action)", flex: "none" }}
                />
              </label>
            ))}
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="group-head">
              <h2 className="lbl">Prototype</h2>
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--ink-body)" }}>
              This version runs on sample data saved in your browser, so your changes survive a
              refresh and nothing leaves your device. Reset it whenever you want a clean slate.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                className="btn"
                onClick={() => {
                  reseed("demo");
                  setDone("Sample content restored");
                }}
              >
                Reset demo data
              </button>
              <button
                className="btn soft"
                onClick={() => {
                  reseed("empty");
                  setDone("Emptied, so you can see day one");
                  router.push("/");
                }}
              >
                Start empty
              </button>
            </div>
            {done && (
              <p className="confirm" style={{ borderTop: "none", paddingTop: 0 }}>
                {done}.
              </p>
            )}
          </section>

          <p className="ending">That&apos;s everything. There isn&apos;t a second page of settings.</p>
        </main>
      </div>
    </div>
  );
}
