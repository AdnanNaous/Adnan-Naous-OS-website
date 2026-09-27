# Adnan Naous

> I build to learn. I keep what works.

[Visit the portfolio](https://adnannaous.vercel.app/)

An English-language portfolio about my projects, current learning, and path from medicine to computing.

## Explore

| Chapter | Interaction |
| --- | --- |
| Home | Full-screen CRT introduction, a live 3D passage, a walking cat, and a command terminal with a code-style CV. |
| Work | Replay the build trace and open two project dossiers. |
| Now | Select one of six learning nodes to reveal its detail beside the node. |
| Codex | Read three long-term directions as the selection cycles or choose one manually. |
| About | Scroll through four chapters of the story. |
| Contact | Open a mail draft, revisit the paused transmission, or follow GitHub, LinkedIn, and X links. |

The environment is built with procedural Three.js geometry and scroll-linked camera shots. It keeps HTML content accessible when WebGL is unavailable. The interface includes keyboard navigation, reduced-motion behavior, and responsive layouts. The terminal accepts a small documented set of portfolio commands; it does not execute arbitrary code.

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
