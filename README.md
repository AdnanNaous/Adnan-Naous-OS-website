# Adnan Naous

> I build to learn. I keep what works.

[Visit the portfolio](https://adnannaous.vercel.app/)

An English-language portfolio about my projects, current learning, and path from medicine to computing.

## Explore

| Chapter | Interaction |
| --- | --- |
| Home | A three-beat monochrome boot, clear typography, and a terminal with an extracted CV, dot-script animation, and code editors. Repeat visits skip the boot. |
| Brain | Layered archive and reading windows on desktop; one panel with page scrolling on phones. Search three dated entries and choose source-linked guided answers. |
| Work | An assembling project index and three distinct project dossiers, including the public learning journey. Projects are immediately accessible. |
| Now | Select one of six current learning nodes in an open schematic with a fixed 70% energy motif. |
| Codex | Read three long-term directions. Pause the cycle or select a chapter to keep it open. |
| About | Follow four factual memories from medicine to computing, in document order, with native chapter links. Every chapter stays readable in all motion modes. |
| Contact | Confirm an email, explore the optional simulated system incident, or follow GitHub, LinkedIn, X, and Linktree links. |

Seven procedural Canvas2D scenes live in `src/graphics/`: identity blades, memory topology, construction plates, skill routes, a long-range trajectory, an origin waveform, and a final light slit. `src/motion/runtime.ts` provides one animation clock and cached section measurements for canvas, navigation, and scroll-driven content. Rendering adapts its cadence and resolution, pauses in hidden tabs, settles during reading, and has a static CSS fallback. No graphics library or WebGPU requirement is added. The actual content remains semantic HTML.

The terminal runs JavaScript and dot scripts in a restricted browser sandbox. Java and Python use an embedded [OneCompiler](https://onecompiler.com/apis/embed-editor) editor; code entered there is sent to that service. The visitor shell has no administrator access.

Brain Q&A is a local, curated question collection. It uses no AI provider, API route, or database. `src/data/brainPromptSampling.ts` selects three unique questions and avoids the current group when enough alternatives exist. Add source-linked questions to small `brainPromptChunk*.ts` files (about 100 per chunk), then register each chunk's count and import in `src/data/brainPrompts.ts`. Only selected chunks load; the sampler supports a 10,000-question collection without rendering or loading all answers at once. The current collection contains six questions.

Typography is self-hosted in `src/app/typography.css`: Space Grotesk gives existing headings an architectural character, Inter keeps narrative text readable, and IBM Plex Mono handles technical labels. The three SIL OFL notices are in `public/fonts/`. Headings remain semantic HTML with stable glyphs during scrolling and hover. The added Latin variable face is 22,288 bytes.

The two original Home name lines use a small shared SVG material filter: blurred glyph alpha isolates an inner edge, an overlay blend gives depth, and equal RGB transfer keeps the finish silver. A clipped repeating gradient passes across the selectable HTML text, followed by long still intervals. It pauses offscreen and in hidden tabs; reduced motion and forced colors retain readable static text. The font, glyph geometry and layout are unchanged. No shader library, video asset, external service or duplicate text is used.

The background alone dissolves between chapters over 520ms, using one reusable Canvas2D snapshot and the shared adaptive clock. Rapid navigation retargets from the current image; there is no full-screen shutter, hidden text, or queued navigation. Reduced motion and quiet reading update immediately.

Object motion preserves the existing layout, content and physical environments. Home settles into place; the Brain trace draws across the archive threshold; dossier marks respond to opening records; the selected skill route transfers; story lines and chapter indicators follow reading progress. Codex advances on the shared clock and retains its phase when hovered, focused, paused or offscreen. Camera depth and neutral lighting move gently, with long rests between mechanical movements. Added DOM motion uses cached ranges and visibility observers; reduced motion retains the complete interface.

Seven cached perspective environments live in `src/graphics/scenes/environment.ts`. Mesh faces are depth sorted with deterministic surface detail; mobile selects fewer, larger forms. About keeps its decorative environment clipped above four normal-flow factual chapters. Contact uses an explicit full-width grid with bounded transmission rows. No external reference media or models are shipped.

## Run locally

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Run checks before publishing:

```sh
pnpm lint
pnpm build
pnpm start
```

With the server running, in another terminal:

```sh
pnpm test:browser
node scripts/ratios.mjs
node scripts/materials-smoke.mjs
node scripts/pulse-smoke.mjs
node scripts/type-material-smoke.mjs
node --test scripts/motion-runtime.test.mjs scripts/brain-prompt-sampling.test.mjs
```

The browser checks default to `http://127.0.0.1:3000`; set `BASE_URL` for another address.
The material check inspects actual screenshot pixels through four light phases, preserves text geometry, and covers reduced motion, solid text fallback and rendering without JavaScript. Set `TEST_WEBKIT=1` after installing Playwright WebKit to check that engine alongside Chrome.

## Rights

آ© 2026 Adnan Naous. All rights reserved. The CV in `public/documents/` is a personal document, not a reusable site asset.
