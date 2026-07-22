# Step 3 Design-System Foundation

## Scope

This foundation translates the approved cinematic visual direction into reusable primitives without implementing the final homepage, hero, desktop navigation, mobile navigation, portrait composition, or production-page redesign.

The internal preview is available at `/internal/design-system`. It is marked `noindex` and contains neutral specimen content only.

## Adoption Boundary

- Semantic tokens use the `--ds-*` prefix.
- Component styles are scoped beneath `.ds-scope`.
- `src/app/internal/design-system/layout.tsx` is the only current stylesheet import boundary.
- Existing production components do not load or use the new classes yet, so their current appearance remains unchanged.
- The approved concept image is a visual reference only. It is not copied into `public/`, imported by source code, or included in the runtime bundle.

## Foundations

### Color

The semantic color roles provide near-black and warm neutral canvases, readable ink levels, restrained bronze emphasis, borders, focus, feedback, and surface materials. Light and dark values are supplied without changing the existing application theme variables.

### Typography

The system provides display, heading, title, body, label, metadata, and monospace roles using local system fonts. Arabic overrides use Tahoma and Arial to preserve shaping and readability.

### Layout

Container, stack, cluster, responsive grid, Dock, DockItem, reading-width, safe-area, and neutral composition-region utilities use logical properties and intrinsic sizing. The abstract preview demonstrates desktop regions, mobile reordering, optional metadata removal, and dock compression without reproducing a final page.

### Surfaces and Controls

Matte, elevated, glass, pill, spotlight, and accent-border treatments use fallback-first backgrounds. Button, action-link, icon-control, text-field, Dock, and DockItem primitives include practical target sizes, visible focus, disabled states, labels, help text, error plumbing, internal separators, RTL-safe logical spacing, and responsive dock compression.

### Motion and Preferences

Motion uses CSS opacity and transforms with shared duration and easing tokens. `prefers-reduced-motion`, `prefers-reduced-transparency`, and forced-colors adaptations are included.

### Performance

The foundation adds no dependencies, client state, browser event listeners, external fonts, images, or JavaScript animation runtime. The preview is a Server Component and the background atmosphere uses lightweight CSS layers.

## Reusable Modules

- `src/styles/design-system.css`: semantic tokens and scoped foundation classes.
- `src/components/design-system/Primitives.tsx`: typed server-compatible layout, surface, dock, control, and field primitives. `Dock` supports semantic container elements and matte or selectively translucent presentation; `DockItem` provides consistent internal structure and separators.
- `src/components/design-system/index.ts`: stable public export for the primitives.
- `src/app/internal/design-system/layout.tsx`: route-local stylesheet boundary for the preview.
- `src/app/internal/design-system/page.tsx`: isolated internal specimen.

## Future Migration Rule

Production pages should adopt the foundation only through a separately approved migration. Factual content must continue to come from the approved public-data boundary, and internal review data must never be imported into client runtime code.
