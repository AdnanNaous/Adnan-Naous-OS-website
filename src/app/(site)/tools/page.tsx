import type { Metadata } from "next";
import { PersonalOSExperience } from "@/components/site/PersonalOSExperience";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Personal OS",
  description: "A functioning personal workspace with a focus timer, command center, public GitHub activity, and an approved resource library.",
  path: "/tools",
});

export default function ToolsPage() {
  return <PersonalOSExperience />;
}
