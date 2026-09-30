# Adnan Naous

> I build to learn. I keep what works.

[Visit the portfolio](https://adnannaous.vercel.app/)

An English-language portfolio about my projects, current learning, and path from medicine to computing.

## Explore

| Chapter | Interaction |
| --- | --- |
| Home | A three-beat monochrome boot, kinetic identity, and a terminal with an extracted CV, dot-script animation, and code editors. Repeat visits skip the boot. |
| Brain | Layered archive and reading windows on desktop; one panel with page scrolling on phones. Search three dated entries and choose source-linked guided answers. |
| Work | An assembling project index and three distinct project dossiers, including the public learning journey. Projects are immediately accessible. |
| Now | Select one of six current learning nodes in an open schematic with a fixed 70% energy motif. |
| Codex | Read three long-term directions. Pause the cycle or select a chapter to keep it open. |
| About | Follow four factual memories from medicine to computing, through scrolling or chapter buttons. Reduced motion shows every chapter in order. |
| Contact | Confirm an email, explore the optional simulated system incident, or follow GitHub, LinkedIn, X, and Linktree links. |

Seven procedural Canvas2D scenes live in `src/graphics/`: identity blades, memory topology, construction plates, skill routes, a long-range trajectory, an origin waveform, and a final light slit. `src/motion/runtime.ts` provides one animation clock and cached section measurements for canvas, navigation, and scroll-driven content. Rendering adapts its cadence and resolution, pauses in hidden tabs, settles during reading, and has a static CSS fallback. No graphics library or WebGPU requirement is added. The actual content remains semantic HTML.

The terminal runs JavaScript and dot scripts in a restricted browser sandbox. Java and Python use an embedded [OneCompiler](https://onecompiler.com/apis/embed-editor) editor; code entered there is sent to that service. The visitor shell has no administrator access.

Brain Q&A is a local, curated question collection. It uses no AI provider, API route, or database. `src/data/brainPromptSampling.ts` selects three unique questions and avoids the current group when enough alternatives exist. Add source-linked questions to small `brainPromptChunk*.ts` files (about 100 per chunk), then register each chunk's count and import in `src/data/brainPrompts.ts`. Only selected chunks load; the sampler supports a 10,000-question collection without rendering or loading all answers at once. The current collection contains six questions.

Typography is self-hosted in `src/app/typography.css`: Source Serif 4 gives Home/Brain an editorial voice and About/Contact an italic voice; Roboto Condensed gives Work an industrial voice; IBM Plex Mono gives Codex a precise voice; Inter stays on body text and the learning map. Only used Latin faces load. All four SIL OFL notices are in `public/fonts/`.

`src/graphics/optics/` captures real heading line breaks and renders a bounded traveling deformation front in one WebGL canvas. Wavelength samples follow warped glyph edges; the scene canvas supplies refraction. DOM headings stay semantic and immediately regain their paint on graphics failure/context loss. Reduced motion uses stable glyphs. The rasterizer caches geometry and recaptures after font, layout or viewport changes.

`src/motion/transition.ts` is the reversible black shutter controller. Semantic navigation follows scrolling immediately; `visualChapter` changes only after a full covered frame, and stays covered for the first frame of the new environment. Repeated destinations/reversals coalesce. All motion uses the shared adaptive clock; pointer velocity is bounded and position/force damp back to rest.

Seven cached perspective environments live in `src/graphics/scenes/environment.ts`. Mesh faces are depth sorted with deterministic surface detail; mobile selects fewer, larger forms. About reuses the same shutter controller inside three separate environmental/narrative/navigation regions. Contact uses an explicit full-width grid with left-aligned bounded transmission rows, replacing automatic left margins. No external reference media or models are shipped.

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
node --test scripts/scene-transition.test.mjs scripts/motion-runtime.test.mjs
```

The browser checks default to `http://127.0.0.1:3000`; set `BASE_URL` for another address.

## Rights

© 2026 Adnan Naous. All rights reserved. The CV in `public/documents/` is a personal document, not a reusable site asset.
