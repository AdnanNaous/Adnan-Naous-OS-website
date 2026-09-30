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

Interface typography uses self-hosted Inter Variable; its license is in `public/fonts/Inter-OFL.txt`. Terminal text retains its monospace face.

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
```

The browser checks default to `http://127.0.0.1:3000`; set `BASE_URL` for another address.

## Rights

© 2026 Adnan Naous. All rights reserved. The CV in `public/documents/` is a personal document, not a reusable site asset.
