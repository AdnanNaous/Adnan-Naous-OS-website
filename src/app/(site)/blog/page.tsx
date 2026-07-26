import type { Metadata } from "next";
import { WritingExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Writing",
  description: "A future-ready writing system for evidence-based notes, currently published with no fabricated articles.",
  path: "/blog",
});

export default function WritingPage() {
  return <LocalizedContent english={<WritingExperience locale="en" />} arabic={<WritingExperience locale="ar" />} />;
}
