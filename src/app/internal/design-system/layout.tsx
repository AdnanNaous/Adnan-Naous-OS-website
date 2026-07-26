import "@/styles/design-system.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignSystemPreviewLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div id="main-content" tabIndex={-1} className="min-h-screen">
      {children}
    </div>
  );
}
