import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import "./revision.css";
import "./polish.css";
import "./feedback-polish.css";
import "./brain.css";
import "./evolution.css";
import "./work-v2.css";
import "./now-v2.css";
import "./intro-retro.css";
import "./typography.css";
import "./object-motion.css";
import "./records-motion.css";
import "./story-motion.css";
import "./type-material.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adnannaous.vercel.app"),
  title: "Adnan Naous — Software & curiosity",
  description: "Computer Science & AI student. Explore my projects, background, and get in touch.",
  openGraph: { title: "Adnan Naous", description: "Software, experiments, and the next idea.", type: "website" },
  twitter: { card: "summary", creator: "@vc_351" },
};
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="en" dir="ltr" suppressHydrationWarning style={{ "--font-interface": '"Inter Variable", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } as React.CSSProperties}><body>{children}</body></html>;
}
