import type { Metadata } from "next";
import { ContactExperience } from "@/components/site/EditorialPages";
import { LocalizedContent } from "@/components/site/LocalizedContent";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Contact",
  description: "Contact Adnan Naous about internships, entry-level software work, collaborative learning, and appropriate student or open-source projects.",
  path: "/contact",
});

export default function ContactPage() {
  return <LocalizedContent english={<ContactExperience locale="en" />} arabic={<ContactExperience locale="ar" />} />;
}
