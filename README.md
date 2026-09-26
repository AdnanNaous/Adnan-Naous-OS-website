# Adnan Naous — Portfolio

A bilingual portfolio built with Next.js, React, TypeScript, and Three.js. It uses the self-hosted Thmanyah Sans family throughout and supports both English and Arabic layouts.

The continuous background is an original, procedural WebGL scene: machined rings, a glass core, fasteners, travelling white energy traces, architectural columns, light shafts, and particles respond to pointer and scroll input. A sparse mathematical overlay shows the actual scroll phase and a derived sine value alongside orbital notation. No game art, stock photograph, or pre-rendered backdrop is used. Text and links remain HTML, so the projects, CV, and contact action work independently of the scene. If WebGL is unavailable, a dark gradient remains. Reduced-motion preferences are respected.

The navigation and left timeline track six destinations. The hero has a visitor terminal with a small optional easter egg. Project details expand inline, the Now section has a qualitative activity indicator, and Codex records current learning and work directions. The About story shows one short beat at a time as the visitor scrolls. The main contact action opens an email draft directly.

## Development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Run `pnpm build`, `pnpm lint`, and `pnpm start` for a production check. With the local server running, `pnpm test:browser` covers core interactions, and `node scripts/ratios.mjs` checks desktop and mobile widths in both languages. Set `BASE_URL` to test another deployment.

The public site is [adnannaous.vercel.app](https://adnannaous.vercel.app/).
