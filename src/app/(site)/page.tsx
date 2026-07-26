import type { Metadata } from "next";
import { HomeComposition } from "@/components/home/HomeComposition";
import { LocalizedHomepage } from "@/components/home/LocalizedHomepage";
import { getHomepageContent } from "@/components/home/homeContent";
import styles from "@/components/home/home.module.css";
import { createRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = createRouteMetadata({
  title: "Adnan Naous | Computer Science Student",
  description: "Explore three evidence-led software projects, a documented learning journey, and a practical Personal OS by Adnan Naous.",
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  const english = getHomepageContent("en");
  const arabic = getHomepageContent("ar");

  return (
    <div className={styles.homepage} data-homepage-phase-a>
      <LocalizedHomepage
        english={<HomeComposition content={english} />}
        arabic={<HomeComposition content={arabic} />}
      />
    </div>
  );
}
