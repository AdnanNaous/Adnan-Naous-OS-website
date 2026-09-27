import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import "./revision.css";
import "./work-v2.css";
import "./now-v2.css";
import "./intro-retro.css";
import "./polish.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://adnannaous.vercel.app"),
  title: "Adnan Naous — Software & curiosity",
  description: "Computer Science & AI student. Explore my projects, background, and get in touch.",
  openGraph: { title: "Adnan Naous", description: "Software, experiments, and the next idea.", type: "website" },
  twitter: { card: "summary", creator: "@vc_351" },
};
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="en" dir="ltr" style={{ "--font-interface": '"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' } as React.CSSProperties}><body>{children}</body></html>;
}
