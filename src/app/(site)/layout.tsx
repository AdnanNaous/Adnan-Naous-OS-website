import "@/styles/design-system.css";
import { SiteShell } from "@/components/site/SiteShell";
import { publicData } from "@/data/public";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: ["en", "ar"],
  author: {
    "@type": "Person",
    name: publicData.profile.displayName,
    url: SITE_URL,
    sameAs: publicData.profile.socialProfiles.map((profile) => profile.url),
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
      />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
