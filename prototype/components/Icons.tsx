type P = { size?: number; color?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  "aria-hidden": true,
});

export const Search = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const Plus = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Dots = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} fill={color}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);

export const Clock = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
);

export const Box = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 6h16v4H4zM6 10v9h12v-9M10 14h4" />
  </svg>
);

export const Eye = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const Check = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Filter = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round">
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const Play = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} fill={color}>
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const Trash = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);

export const External = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
  </svg>
);

export const Back = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const Close = ({ size = 18, color = "currentColor" }: P) => (
  <svg {...base(size)} stroke={color} strokeWidth={2} strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Arrow = ({ size = 22, color = "#b23a26" }: P) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    style={{ verticalAlign: "-4px", marginLeft: 6 }}
  >
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const Mark = ({ size = 28 }: P) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
    <circle cx="14" cy="14" r="12" stroke="#6b6b2f" strokeWidth={2} />
    <path d="M8 16c3-4 9-4 12 0" stroke="#6b6b2f" strokeWidth={2} strokeLinecap="round" />
    <circle cx="20" cy="8" r="3" fill="#b23a26" />
  </svg>
);
