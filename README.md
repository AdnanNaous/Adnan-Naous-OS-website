# Adnan Naous

> I build to learn. I keep what works.

[Visit the portfolio](https://adnannaous.vercel.app/)

An English-language portfolio about my projects, current learning, and path from medicine to computing.

## Explore

| Chapter | Interaction |
| --- | --- |
| Home | Full-screen CRT introduction, a layered memory environment, and a monochrome terminal with an extracted CV, dot-script animation, and code editors. |
| Brain | Open one archive or thought window at a time, search three dated entries, and choose source-linked guided questions. |
| Work | Scroll through a pinned project-index build, then open three project dossiers, including the public learning journey. |
| Now | Select one of six learning nodes beside a 70% progress meter. |
| Codex | Read three long-term directions as the selection cycles or choose one manually. |
| About | Scroll through four chapters as a field of blurred code fades away. |
| Contact | Confirm an email, explore the optional simulated system incident, or follow GitHub, LinkedIn, X, and Linktree links. |

The background is a layered Canvas2D illustration in `src/graphics/`, with section-aware depth, a static CSS fallback, capped resolution, and reduced-motion support. Its renderer is separate from the Brain content and UI; `src/graphics/state.ts` carries the reading-state signal. No WebGL or WebGPU path is required. The interface keeps HTML content accessible and includes keyboard navigation and responsive layouts. The terminal runs JavaScript and dot scripts in a restricted browser sandbox. Java and Python use an embedded [OneCompiler](https://onecompiler.com/apis/embed-editor) editor; code entered there is sent to that service. The visitor shell has no administrator access.

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
