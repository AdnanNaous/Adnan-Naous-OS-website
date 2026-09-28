# Adnan Naous

> I build to learn. I keep what works.

[Visit the portfolio](https://adnannaous.vercel.app/)

An English-language portfolio about my projects, current learning, and path from medicine to computing.

## Explore

| Chapter | Interaction |
| --- | --- |
| Home | Full-screen CRT introduction, a procedural server passage, and a monochrome terminal with an extracted CV, dot-script animation, and code editors. |
| Work | Scroll through a pinned project-index build, then open three project dossiers, including the public learning journey. |
| Now | Select one of six learning nodes beside a 70% progress meter. |
| Codex | Read three long-term directions as the selection cycles or choose one manually. |
| About | Scroll through four chapters as a field of blurred code fades away. |
| Brain | Open a public thought archive, search three dated entries, and layer their windows without losing the archive. |
| Contact | Confirm an email, explore the optional simulated system incident, or follow GitHub, LinkedIn, and X links. |

The environment is built with procedural Three.js geometry and scroll-linked camera shots. It keeps HTML content accessible when WebGL is unavailable. The interface includes keyboard navigation, reduced-motion behavior, and responsive layouts. The terminal runs JavaScript and dot scripts in a restricted browser sandbox. Java and Python use an embedded [OneCompiler](https://onecompiler.com/apis/embed-editor) editor; code entered there is sent to that service. The visitor shell has no administrator access.

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
