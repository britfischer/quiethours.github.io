export type Kind = "article" | "video" | "podcast" | "discussion";

export type Source = {
  id: string;
  title: string;
  kind: Kind;
  site: string;
  color: string;
  status: "ok" | "needs_attention";
  folderIds: string[];
};

export type Folder = { id: string; name: string };

export type Item = {
  id: string;
  sourceId: string;
  title: string;
  standfirst: string;
  body: string[];
  kind: Kind;
  minutes: number;
  publishedAt: string; // ISO
  // state
  seenAt: string | null;
  savedAt: string | null;
  archivedAt: string | null;
  deletedAt: string | null;
};

export type Store = {
  version: number;
  sources: Source[];
  folders: Folder[];
  items: Item[];
  settings: {
    markSeenOnScroll: boolean;
    showCounts: boolean;
    openOriginal: boolean;
  };
};
