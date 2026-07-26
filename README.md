# Adnan Naous — Portfolio & Personal OS

**Production:** [https://adnannaous.vercel.app/](https://adnannaous.vercel.app/)

A bilingual, evidence-led portfolio for Adnan Naous, a Computer Science and Artificial Intelligence student. The site combines public project case studies with a practical Personal OS while keeping factual content inside a validated client-safe data boundary.

## Current Experience

- **AI Core homepage:** A route-local Three.js visual with a CSS/SVG fallback, reduced-motion behavior, context-loss handling, visibility throttling, and mobile-specific rendering limits.
- **Three project case studies:** Adnan Naous OS Website, Adnan Naous Journey, and Ultimate Windows Maintenance are presented with real repository evidence, current status, decisions, limitations, and locally authored diagrams or current screenshots.
- **Unified site shell:** Every public route shares the production navigation, footer, optical black-and-white theme, language control, theme control, keyboard focus system, and responsive layout.
- **Truthful public sections:** `/services` presents Capabilities & Collaboration, `/blog` presents an honest Writing empty state, and `/testimonials` presents verified Recognition rather than fabricated services, posts, or endorsements.
- **Personal OS:** `/tools` contains the focus timer, command center, public GitHub activity integration, and a curated public resource library.
- **English and Arabic:** Public routes support LTR and RTL presentation. Language state currently defaults to English after a reload and is not persisted.
- **Dark and light themes:** Class-based themes are provided through `next-themes`.

## Public Routes

| URL | Purpose |
| --- | --- |
| `/` | Portfolio homepage and AI Core |
| `/about` | Personal story, education, current learning, and working principles |
| `/portfolio` | Three evidence-based project case studies |
| `/services` | Capabilities & Collaboration |
| `/blog` | Writing system and truthful empty state |
| `/testimonials` | Recognition and verified credential context |
| `/contact` | Opportunity-focused contact information |
| `/tools` | Personal OS workspace |

The internal `/internal/design-system` specimen is excluded from search indexing.

## Technology

- Next.js 16.2.10 with the App Router
- React and React DOM 19.2.4
- TypeScript 5
- Tailwind CSS 4 through `@tailwindcss/postcss`
- Framer Motion 12
- Three.js 0.185.1 and React Three Fiber 9.6.1, loaded only by the homepage AI Core
- `next-themes` 0.4.6
- `react-github-calendar` 5.0.6

## Architecture

- `src/app/(site)/` owns the shared public-site layout and all eight public URLs.
- `src/app/(site)/tools/layout.tsx` scopes dashboard state to `/tools`.
- `src/data/public.ts` is the approved client-safe factual boundary.
- `src/data/search.ts` derives the future static search records from `publicData`.
- Internal review data is not imported by runtime client code.
- `src/styles/design-system.css` provides the shared semantic optical design tokens and materials.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run lint
npx tsc --noEmit --incremental false
npm run build
node scripts/content/validate-public-data.mjs
git diff --check
```

There is currently no automated unit or integration test script in `package.json`. Browser-level release checks are available through `scripts/quality/release-browser-qa.mjs` when a Chrome DevTools endpoint and a running production server are provided.

## Deployment

`main` is the production branch. The established GitHub-to-Vercel integration performs the production deployment using the standard Next.js configuration; no custom `vercel.json` is present.

---

# عدنان نعوس — معرض الأعمال والنظام الشخصي

**الموقع المنشور:** [https://adnannaous.vercel.app/](https://adnannaous.vercel.app/)

معرض أعمال ثنائي اللغة قائم على الأدلة لعدنان نعوس، طالب علوم الحاسوب والذكاء الاصطناعي. يجمع الموقع دراسات حالة لمشاريع عامة مع نظام شخصي عملي، مع إبقاء الحقائق داخل حدود بيانات عامة متحقَّق منها وآمنة للاستخدام في الواجهة.

## التجربة الحالية

- **الصفحة الرئيسية ونواة الذكاء الاصطناعي:** عنصر بصري محلي لمسار الصفحة الرئيسية مبني بـ Three.js، مع بديل CSS/SVG، ودعم تقليل الحركة، وفقدان سياق WebGL، وإيقاف العمل خارج مجال الرؤية، وإعدادات أخف للهاتف.
- **ثلاث دراسات حالة:** تُعرض مشاريع Adnan Naous OS Website وAdnan Naous Journey وUltimate Windows Maintenance بأدلة المستودعات الفعلية وحالتها الحالية وقراراتها وحدودها ومخططات محلية أو لقطات حالية.
- **إطار موحّد للموقع:** تشترك جميع المسارات العامة في التنقل والتذييل والهوية البصرية بالأبيض والأسود والتحكم باللغة والسمة والتركيز بلوحة المفاتيح والتخطيط المتجاوب.
- **أقسام عامة صادقة:** يعرض `/services` القدرات والتعاون، ويعرض `/blog` حالة كتابة فارغة وصادقة، ويعرض `/testimonials` تقديرًا موثقًا بدل خدمات أو مقالات أو تزكيات مختلقة.
- **النظام الشخصي:** يضم `/tools` مؤقت التركيز ومركز الأوامر وتكامل نشاط GitHub العام ومكتبة موارد عامة منسقة.
- **الإنجليزية والعربية:** تدعم المسارات العامة اتجاهي LTR وRTL. تبدأ اللغة بالإنجليزية بعد إعادة التحميل ولا تُحفظ حاليًا.
- **الوضع الداكن والفاتح:** تتم إدارة السمات عبر `next-themes`.

## التقنيات

- Next.js 16.2.10 مع App Router
- React وReact DOM 19.2.4
- TypeScript 5
- Tailwind CSS 4 عبر `@tailwindcss/postcss`
- Framer Motion 12
- Three.js 0.185.1 وReact Three Fiber 9.6.1، ويُحمّلان فقط لنواة الصفحة الرئيسية
- `next-themes` 0.4.6
- `react-github-calendar` 5.0.6

## التشغيل والتحقق

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit --incremental false
npm run build
node scripts/content/validate-public-data.mjs
git diff --check
```

لا يوجد حاليًا أمر اختبارات آلية للوحدات أو التكامل داخل `package.json`.

## النشر

الفرع `main` هو فرع الإنتاج، ويستخدم المشروع تكامل GitHub مع Vercel وإعداد Next.js القياسي دون ملف `vercel.json` مخصص.
