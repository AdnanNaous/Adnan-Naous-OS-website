# Adnan Naous.

> I build to learn. I keep what works.
>
> أبني لأتعلّم، وأحسّن ما ينجح.

[Enter the site ↗](https://adnannaous.vercel.app/)

`AN // VISITOR CHANNEL` · Computer Science & AI student · Arabic / English

## 01 / The signal

This is my working portfolio: projects I am building, what I am learning now, the path that brought me here, and a direct way to reach me. Every chapter has its own interaction, but the record is still in progress.

## 02 / Explore

| Channel | What you will find |
| --- | --- |
| **Work** | Replay a code-style build trace, then open two project dossiers. |
| **Now** | Explore six CV-grounded learning nodes across foundations, systems, and building. The 70% energy bar is a visual status, not a measured productivity score. |
| **Codex** | Select one of three long-term chapters: learn deeply, make useful software, contribute to a team. |
| **About** | Follow a pixel beacon through four chapters grounded in my CV, from medicine to computing and the work ahead. |
| **Contact** | Open a mail draft through the final transmission, recall its paused action, or use the always-available email link. |

## 03 / Built from code

Next.js, React, TypeScript, and Three.js power the site. The strictly grayscale world is procedural WebGL: machined rings, glass, fasteners, energy traces, light, and particles. The model slowly spins while pointer and scroll movement change its view. On capable desktop screens it casts real-time shadows; smaller screens use a lighter rendering path. The mathematical notation reflects real scroll values. All essential content remains readable HTML. There are no game assets or stock backgrounds.

The interface supports Arabic and English, keyboard navigation, reduced motion, narrow screens, and a fallback when WebGL is unavailable. Thmanyah Sans is self-hosted.

A short monochrome CRT introduction opens the visit. It closes on a fixed timer rather than waiting for WebGL or fonts, and can be skipped with its button or Escape.

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
