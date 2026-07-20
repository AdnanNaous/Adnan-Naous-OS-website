import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/context/DashboardContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Adnan Naous | Portfolio",
  description: "Personal Portfolio and OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LanguageProvider>
            <DashboardProvider>
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <Navbar />
              <div id="main-content" tabIndex={-1} className="pt-24 min-h-screen">
                {children}
              </div>
            </DashboardProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
