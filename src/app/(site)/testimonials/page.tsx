import type { Metadata } from "next";
import { RecognitionExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Recognition",
  description: "Verified credential evidence and its exact context, without invented endorsements or testimonials.",
  path: "/testimonials",
});

export default function RecognitionPage() {
  return <LocalizedContent english={<RecognitionExperience locale="en" />} arabic={<RecognitionExperience locale="ar" />} />;
}
