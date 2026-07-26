import { DesignSystemScope } from "@/components/design-system";
import { ProductionNavigation } from "@/components/navigation/ProductionNavigation";
import { publicData } from "@/data/public";
import styles from "./SiteShell.module.css";
import { SiteFooter } from "./SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemScope className={`${styles.shell} ds-atmosphere`}>
      <div className={styles.ambientLight} aria-hidden="true" />
      <div className={styles.spectralMist} aria-hidden="true" />
      <ProductionNavigation
        brand={publicData.profile.brand}
        displayName={publicData.profile.displayName}
        githubUrl={publicData.github.profileUrl}
      />
      <div id="main-content" tabIndex={-1} className={styles.content}>
        {children}
      </div>
      <SiteFooter />
    </DesignSystemScope>
  );
}
