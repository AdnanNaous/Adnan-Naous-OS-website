import type { Metadata } from "next";

export const SITE_URL = "https://adnannaous.vercel.app";
export const SITE_NAME = "Adnan Naous Portfolio & Personal OS";
export const DEFAULT_TITLE = "Adnan Naous | Computer Science Student";
export const DEFAULT_DESCRIPTION =
  "Evidence-led software projects, a public learning journey, and a practical Personal OS by Computer Science student Adnan Naous.";

type RouteMetadataOptions = {
  title: string;
  description: string;
  path: `/${string}` | "/";
  absoluteTitle?: boolean;
};

export function createRouteMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: RouteMetadataOptions): Metadata {
  const resolvedTitle = absoluteTitle ? title : `${title} | Adnan Naous`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: resolvedTitle,
      description,
      url: path,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Adnan Naous Portfolio and Personal OS",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
