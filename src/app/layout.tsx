import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import "./experience.css";

const thmanyah = localFont({ src: [
  { path: "../fonts/thmanyahsans-Regular.otf", weight: "400" },
  { path: "../fonts/thmanyahsans-Medium.otf", weight: "500 600" },
  { path: "../fonts/thmanyahsans-Bold.otf", weight: "700 900" },
], variable: "--font-thmanyah", display: "swap" });
export const metadata: Metadata = {
  metadataBase: new URL("https://adnannaous.vercel.app"),
  title: "Adnan Naous — Software & curiosity",
  description: "Computer Science & AI student. Explore my projects, background, and get in touch.",
  openGraph: { title: "Adnan Naous", description: "Software, experiments, and the next idea.", type: "website" },
  twitter: { card: "summary", creator: "@vc_351" },
};
export default async function Layout({children}: {children: React.ReactNode}) {
  const ar = (await cookies()).get("portfolio-language")?.value === "ar";
  return <html lang={ar ? "ar" : "en"} dir={ar ? "rtl" : "ltr"} className={thmanyah.variable}><body>{children}</body></html>;
}
