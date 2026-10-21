"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Mark, Plus, Search } from "./Icons";
import AddOverlay from "./AddOverlay";
import SearchOverlay from "./SearchOverlay";

const places = [
  { href: "/", label: "Home" },
  { href: "/feed", label: "Feed" },
  { href: "/library", label: "Library" },
  { href: "/listen", label: "Listen" },
  { href: "/sources", label: "Sources" },
];

export default function Header() {
  const path = usePathname() || "/";
  const [add, setAdd] = useState(false);
  const [search, setSearch] = useState(false);

  const active = (href: string) => {
    if (href === "/") return path === "/";
    return path.startsWith(href);
  };

  return (
    <>
      <header className="top">
        <Link className="brand" href="/">
          <Mark />
          quiet hours
        </Link>
        <nav className="nav" aria-label="Main">
          {places.map((p) => (
            <Link key={p.href} href={p.href} className={active(p.href) ? "on" : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ib" aria-label="Search" onClick={() => setSearch(true)}>
            <Search />
          </button>
          <button className="add" onClick={() => setAdd(true)}>
            <span aria-hidden style={{ marginRight: 6 }}>
              +
            </span>
            Add
          </button>
        </div>
      </header>
      {add && <AddOverlay onClose={() => setAdd(false)} />}
      {search && <SearchOverlay onClose={() => setSearch(false)} />}
      <span style={{ display: "none" }}>
        <Plus />
      </span>
    </>
  );
}
