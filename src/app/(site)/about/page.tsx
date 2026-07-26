import type { Metadata } from "next";
import { AboutExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "About",
  description: "Adnan Naous's transition from previous medical study to Computer Science and Artificial Intelligence, current learning, and working principles.",
  path: "/about",
});

export default function AboutPage() {
  return <LocalizedContent english={<AboutExperience locale="en" />} arabic={<AboutExperience locale="ar" />} />;
}
