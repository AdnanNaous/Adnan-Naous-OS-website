import type { CSSProperties } from "react";
import type { Metadata } from "next";
import {
  ActionLink,
  Button,
  Cluster,
  Container,
  DesignSystemScope,
  Dock,
  DockItem,
  IconButton,
  ResponsiveGrid,
  Stack,
  Surface,
  TextField,
} from "@/components/design-system";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design System Preview",
  description: "Internal Step 3 design-system foundation preview.",
  robots: {
    index: false,
    follow: false,
  },
};

const swatches = [
  { name: "Canvas", token: "--ds-canvas", color: "var(--ds-canvas)" },
  { name: "Raised canvas", token: "--ds-canvas-raised", color: "var(--ds-canvas-raised)" },
  { name: "Ink", token: "--ds-ink", color: "var(--ds-ink)", ink: "var(--ds-canvas)" },
  { name: "Muted ink", token: "--ds-ink-muted", color: "var(--ds-ink-muted)", ink: "var(--ds-canvas)" },
  { name: "Bronze", token: "--ds-accent", color: "var(--ds-accent)", ink: "var(--ds-accent-ink)" },
  { name: "Bronze strong", token: "--ds-accent-strong", color: "var(--ds-accent-strong)", ink: "var(--ds-accent-ink)" },
] as const;

function SectionHeading({ number, title, id }: { number: string; title: string; id: string }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 id={id} className="ds-title">{title}</h2>
      <span className={styles.sectionNumber} aria-hidden="true">
        {number}
      </span>
    </div>
  );
}

export default function DesignSystemPreviewPage() {
  return (
    <DesignSystemScope className={`${styles.preview} ds-atmosphere`}>
      <Container className={styles.previewInner}>
        <Stack style={{ "--ds-stack-gap": "var(--ds-space-7)" } as CSSProperties}>
          <header className={styles.previewHeader}>
            <Stack className="ds-reading-width">
              <p className="ds-label">Step 3 · Internal preview</p>
              <h1 className="ds-heading">Design-system foundation</h1>
              <p className="ds-body">
                A neutral specimen for reusable tokens and primitives. It intentionally does not reproduce a final page, navigation, hero, portrait, or factual portfolio content.
              </p>
            </Stack>
            <span className={styles.statusPill}>Foundation only</span>
          </header>

          <Surface as="section" variant="glass" className={styles.section} aria-labelledby="preview-colors">
            <SectionHeading number="01" title="Semantic color roles" id="preview-colors" />
            <div className={styles.swatchGrid}>
              {swatches.map((swatch) => (
                <div
                  key={swatch.token}
                  className={styles.swatch}
                  style={
                    {
                      "--swatch-color": swatch.color,
                      "--swatch-ink": "ink" in swatch ? swatch.ink : undefined,
                    } as CSSProperties
                  }
                >
                  <span className={styles.swatchName}>{swatch.name}</span>
                  <span className={styles.swatchToken}>{swatch.token}</span>
                </div>
              ))}
            </div>
          </Surface>

          <Surface as="section" variant="matte" className={styles.section} aria-labelledby="preview-type">
            <SectionHeading number="02" title="Typography hierarchy" id="preview-type" />
            <div className={styles.typeScale}>
              <div className={styles.typeRow}>
                <span className="ds-metadata">Display</span>
                <p className={`${styles.displaySample} ds-display`}>
                  Structure with <span className="ds-accent-text">warmth.</span>
                </p>
              </div>
              <div className={styles.typeRow}>
                <span className="ds-metadata">Heading</span>
                <p className="ds-heading">Clear hierarchy, restrained emphasis.</p>
              </div>
              <div className={styles.typeRow}>
                <span className="ds-metadata">Body</span>
                <p className="ds-body">
                  Supporting copy keeps a controlled reading width, generous line height, and dependable contrast across light and dark themes.
                </p>
              </div>
              <div className={styles.typeRow}>
                <span className="ds-metadata">Metadata</span>
                <p className="ds-label">Compact · precise · secondary</p>
              </div>
            </div>
          </Surface>

          <Surface as="section" variant="elevated" className={styles.section} aria-labelledby="preview-surfaces">
            <SectionHeading number="03" title="Surface materials" id="preview-surfaces" />
            <ResponsiveGrid>
              <Surface variant="matte" className={`${styles.surfaceSpecimen} ds-stack`}>
                <span className="ds-label">Matte</span>
                <h3 className="ds-title">Quiet foundation</h3>
                <p className="ds-body">Opaque enough for long-form content and stable contrast.</p>
              </Surface>
              <Surface variant="glass" className={`${styles.surfaceSpecimen} ds-stack ds-spotlight`}>
                <span className="ds-label">Selective glass</span>
                <h3 className="ds-title">Controlled depth</h3>
                <p className="ds-body">A fallback-first translucent layer with restrained blur and reflection.</p>
              </Surface>
              <Surface variant="elevated" accentBorder className={`${styles.surfaceSpecimen} ds-stack ds-motion-lift`}>
                <span className="ds-label">Elevated</span>
                <h3 className="ds-title">Focused hierarchy</h3>
                <p className="ds-body">Warm border, internal highlight, and measured shadow for priority content.</p>
              </Surface>
            </ResponsiveGrid>
          </Surface>

          <Surface as="section" variant="glass" className={styles.section} aria-labelledby="preview-controls">
            <SectionHeading number="04" title="Controls and form states" id="preview-controls" />
            <div className={styles.controlGrid}>
              <Stack>
                <p className="ds-label">Action hierarchy</p>
                <Cluster>
                  <ActionLink href="#preview-layout" variant="primary">Primary action</ActionLink>
                  <ActionLink href="#preview-layout" variant="secondary">Secondary</ActionLink>
                  <ActionLink href="#preview-layout" variant="ghost">Quiet action</ActionLink>
                  <IconButton aria-label="Example compact control">
                    <span className={styles.iconGlyph} aria-hidden="true">+</span>
                  </IconButton>
                  <Button disabled>Disabled</Button>
                </Cluster>
                <p className="ds-body">All controls use practical touch targets and visible keyboard focus states.</p>
              </Stack>
              <Stack>
                <TextField
                  id="preview-field"
                  label="Field label"
                  placeholder="Focus-visible specimen"
                  helpText="Support text is associated with the field."
                  readOnly
                />
              </Stack>
            </div>
          </Surface>

          <Surface as="section" variant="matte" className={styles.section} id="preview-layout" aria-labelledby="preview-layout-title">
            <SectionHeading number="05" title="Responsive composition capability" id="preview-layout-title" />
            <Stack>
              <p className="ds-body">
                Neutral regions demonstrate desktop hierarchy, mobile reordering, metadata reduction, and dock compression without becoming a final hero or navigation implementation.
              </p>
              <div className={styles.compositionFrame} aria-label="Abstract responsive layout regions">
                <div className={styles.compositionContent}>Editorial region</div>
                <div className={styles.compositionMedia}>Neutral media region</div>
                <div className={styles.compositionMeta}>Optional metadata region</div>
                <Dock
                  as="section"
                  variant="glass"
                  className={styles.compositionDock}
                  aria-label="Abstract adaptive dock specimen"
                >
                  <DockItem>
                    <span className="ds-metadata">Item 01</span>
                    <span>Primary slot</span>
                  </DockItem>
                  <DockItem>
                    <span className="ds-metadata">Item 02</span>
                    <span>Secondary slot</span>
                  </DockItem>
                  <DockItem>
                    <span className="ds-metadata">Item 03</span>
                    <span>Optional slot</span>
                  </DockItem>
                  <DockItem>
                    <span className="ds-metadata">Item 04</span>
                    <ActionLink href="#preview-controls" variant="ghost">Focusable slot</ActionLink>
                  </DockItem>
                </Dock>
              </div>
            </Stack>
          </Surface>

          <div className="ds-grid">
            <Surface as="section" variant="elevated" className={styles.rtlSample} dir="rtl" lang="ar">
              <Stack>
                <p className="ds-label">دعم اتجاه الكتابة</p>
                <h2 className="ds-title">نظام تصميم متجاوب من اليمين إلى اليسار</h2>
                <p className="ds-body">تستخدم المسافات والمحاذاة خصائص منطقية للحفاظ على تسلسل بصري واضح في الواجهات العربية.</p>
                <Cluster>
                  <ActionLink href="#preview-motion" variant="primary">إجراء أساسي</ActionLink>
                  <ActionLink href="#preview-motion" variant="secondary">إجراء ثانوي</ActionLink>
                </Cluster>
              </Stack>
            </Surface>

            <Surface as="section" variant="glass" className={styles.section} id="preview-motion">
              <Stack>
                <p className="ds-label">Motion and preference safety</p>
                <div className={`${styles.motionSample} ds-motion-enter ds-motion-lift`} aria-hidden="true">Motion</div>
                <p className="ds-body">CSS-only motion uses shared timing tokens and becomes effectively static when reduced motion is requested.</p>
              </Stack>
            </Surface>
          </div>

          <footer className={`${styles.footerNote} ds-stack`}>
            <p className="ds-metadata">Internal specimen · no production content</p>
            <p className="ds-body">The reference image is not imported, copied, or bundled. Existing production routes remain on their current visual system.</p>
          </footer>
        </Stack>
      </Container>
    </DesignSystemScope>
  );
}
