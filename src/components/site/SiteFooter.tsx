import Link from "next/link";
import { publicData } from "@/data/public";
import { LocalizedContent } from "./LocalizedContent";
import styles from "./SiteFooter.module.css";

type Locale = "en" | "ar";

function FooterContent({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();
  const email = publicData.profile.contacts.find((item) => item.type === "email");
  const copy = locale === "ar"
    ? { pages: "الصفحات", work: "عمل موثّق", connect: "تواصل", built: "بُني ويُصان بواسطة", email: "بدء محادثة بالبريد" }
    : { pages: "Pages", work: "Verified work", connect: "Connect", built: "Built and maintained by", email: "Start a conversation by email" };

  return (
    <footer className={styles.footer} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className={styles.grid}>
        <div className={styles.identity}>
          <p className={styles.brand}>{publicData.profile.displayName}</p>
          <p>{publicData.footer.statement[locale]}</p>
          <p>{publicData.profile.availability[locale]}</p>
        </div>
        <div>
          <h2>{copy.pages}</h2>
          <nav aria-label={copy.pages}>
            {[...publicData.navigation.primary, ...publicData.navigation.secondary].map((item) => (
              <Link key={item.href} href={item.href}>{item.label[locale]}</Link>
            ))}
          </nav>
        </div>
        <div>
          <h2>{copy.work}</h2>
          {publicData.github.repositories.filter((item) => item.featured).map((item) => (
            <a key={item.id} href={item.repositoryUrl} target="_blank" rel="noopener noreferrer">
              {item.shortLabel}
            </a>
          ))}
          <a href={publicData.credentials[0].documentPath} target="_blank" rel="noopener noreferrer">
            {publicData.credentials[0].title}
          </a>
        </div>
        <div>
          <h2>{copy.connect}</h2>
          {email ? <a href={email.href}>{copy.email}</a> : null}
          {publicData.profile.socialProfiles.map((profile) => (
            <a key={profile.id} href={profile.url} target="_blank" rel="noopener noreferrer">
              {profile.label}
            </a>
          ))}
        </div>
      </div>
      <div className={styles.base}>
        <span>© {year} {publicData.profile.displayName}</span>
        <span>{copy.built} {publicData.profile.displayName}</span>
      </div>
    </footer>
  );
}

export function SiteFooter() {
  return <LocalizedContent english={<FooterContent locale="en" />} arabic={<FooterContent locale="ar" />} />;
}
