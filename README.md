# Adnan Naous.

> I build to learn. I keep what works.
>
> أبني لأتعلّم، وأحسّن ما ينجح.

[Enter the site ↗](https://adnannaous.vercel.app/)

`AN // VISITOR CHANNEL` · Computer Science & AI student · Arabic / English

## 01 / The signal

This is my working portfolio: projects I am building, what I am learning now, the path that brought me here, and a direct way to reach me. It is a record in progress, shaped by real work and revision.

## 02 / Explore

| Channel | What you will find |
| --- | --- |
| **Work** | A Windows maintenance toolkit and this website, with notes on how each is made. |
| **Now** | University coursework, Java practice, AI experiments, and my current activity. |
| **Codex** | The direction I am working toward: learn deeply, make useful software, contribute to a team. |
| **About** | A brief, scroll-driven story of my move from medicine to computing. |
| **Contact** | Email and the places where I share my work. |

## 03 / Built from code

Next.js, React, TypeScript, and Three.js power the site. The monochrome world is procedural WebGL: machined rings, glass, fasteners, white energy traces, light, and particles. Pointer and scroll movement influence the scene; the mathematical notation reflects real scroll values. All essential content remains readable HTML. There are no game assets or stock backgrounds.

The interface supports Arabic and English, keyboard navigation, reduced motion, narrow screens, and a fallback when WebGL is unavailable. Thmanyah Sans is self-hosted.

## 04 / Run locally

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Before shipping:

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

The browser checks expect a local server at `http://127.0.0.1:3000`. Set `BASE_URL` to test another URL.

## 05 / Rights

© 2026 Adnan Naous. All rights reserved. The Thmanyah Sans files have their own terms in [`src/fonts/LICENSE.pdf`](src/fonts/LICENSE.pdf). The CV in `public/documents/` is a personal document, not a reusable site asset.
