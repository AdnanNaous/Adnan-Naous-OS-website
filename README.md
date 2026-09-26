# Adnan Naous — Portfolio

A bilingual portfolio for Adnan Naous, built with Next.js, React, TypeScript, and Three.js. The site uses one self-hosted Thmanyah Sans family for English and Arabic, supports RTL, and keeps the work, background, CV, and contact links accessible as real HTML.

The hero is an original layered alien landscape. Its scenery moves with pointer and scroll input; the ivory tree bends gently through a WebGL vertex shader and has an image fallback. The scene pauses when out of view, and reduced-motion users get a still composition. Section headings use restrained signal-fracture motion, while the navigation marker identifies the section in view.

The two images in `public/art/` were made specifically for this portfolio. Marathon and Apple design references informed the direction; their game art, icons, UI, and branded assets are not included. No personal photographs are used.

## Local development

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

For a production check, run `pnpm build`, `pnpm lint`, then `pnpm start`. With the local server running, `pnpm test:browser` checks the primary interactions. `node scripts/ratios.mjs` checks ten viewport sizes in both languages. Set `BASE_URL` to test a different deployment.

Deployment: push the repository to GitHub and deploy the linked project on Vercel. The public site is [adnannaous.vercel.app](https://adnannaous.vercel.app/).
