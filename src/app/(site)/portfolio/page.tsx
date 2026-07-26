import type { Metadata } from "next";
import { PortfolioExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Portfolio",
  description: "Three detailed case studies covering the Adnan Naous OS Website, Adnan Naous Journey, and Ultimate Windows Maintenance.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return <LocalizedContent english={<PortfolioExperience locale="en" />} arabic={<PortfolioExperience locale="ar" />} />;
}
