import type { Metadata } from "next";
import { CapabilitiesExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Capabilities & Collaboration",
  description: "Evidence-backed contribution areas, collaboration fit, and explicit professional boundaries.",
  path: "/services",
});

export default function CapabilitiesPage() {
  return <LocalizedContent english={<CapabilitiesExperience locale="en" />} arabic={<CapabilitiesExperience locale="ar" />} />;
}
