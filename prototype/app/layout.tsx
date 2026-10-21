import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Quiet Hours",
  description: "A private reader for the things you actually want to read, watch and hear.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Figtree:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <StoreProvider>
          <div className="shell">
            <Header />
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
