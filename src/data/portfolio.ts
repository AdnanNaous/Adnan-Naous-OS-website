
export type Language = "en" | "ar";

export const contact = {
  "id": "public-email",
  "type": "email",
  "label": {
    "en": "Email",
    "ar": "البريد الإلكتروني"
  },
  "value": "Adnan.Naous@outlook.com",
  "href": "mailto:Adnan.Naous@outlook.com"
};
export const socials = [
  {
    "id": "github",
    "label": "GitHub",
    "handle": "AdnanNaous",
    "url": "https://github.com/AdnanNaous"
  },
  {
    "id": "linkedin",
    "label": "LinkedIn",
    "handle": "adnan-naous",
    "url": "https://www.linkedin.com/in/adnan-naous/"
  },
  {
    "id": "x",
    "label": "X",
    "handle": "vc_351",
    "url": "https://x.com/vc_351"
  }
];
export const certificate = { documentPath: "/documents/certificates/kanz-ai-hackathon-2026.pdf" };

type Localized = Record<Language, string>;
export type PortfolioProject = {
  slug: string;
  title: Localized;
  summary: Localized;
  category: Localized;
  repositoryUrl: string;
  sections: { title: Localized; body: Localized }[];
};

export const projects: PortfolioProject[] = [
  {
    slug: "windows-maintenance",
    title: { en: "Windows Maintenance", ar: "صيانة Windows" },
    summary: {
      en: "A PowerShell toolkit for checking and maintaining Windows, one step at a time.",
      ar: "أبني أداة PowerShell لفحص Windows وصيانته، خطوة بخطوة.",
    },
    category: { en: "PowerShell · In progress", ar: "PowerShell · قيد التطوير" },
    repositoryUrl: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
    sections: [
      {
        title: { en: "The idea", ar: "الفكرة" },
        body: {
          en: "I wanted to know what a maintenance script would do before running it. So I split checks, cleanup, repair, updates, and reporting into separate modules.",
          ar: "أردت أن أعرف ما سيفعله سكربت الصيانة قبل تشغيله. لذلك فصلت الفحص والتنظيف والإصلاح والتحديثات والتقارير إلى وحدات مستقلة.",
        },
      },
      {
        title: { en: "How it works", ar: "كيف يعمل" },
        body: {
          en: "Choose the modules you need. The toolkit can create a restore point before running them and save local reports in JSON, plain text, and HTML.",
          ar: "تختار الوحدات التي تحتاجها. يمكن للأداة إنشاء نقطة استعادة قبل تشغيلها، ثم حفظ تقارير محلية بصيغ JSON ونص عادي وHTML.",
        },
      },
      {
        title: { en: "What I’m learning", ar: "ما أتعلمه" },
        body: {
          en: "I’m learning to write scripts that are easy to review, keep each action focused, and show clearly when something fails.",
          ar: "أتعلّم كتابة سكربتات يسهل مراجعتها، وتحديد ما تفعله كل خطوة، وإظهار الأخطاء بوضوح.",
        },
      },
      {
        title: { en: "Current status", ar: "الحالة الحالية" },
        body: {
          en: "This is still in progress. It targets Windows 11 and PowerShell 7; some actions need administrator access. Results depend on the machine and the issue.",
          ar: "ما زال المشروع قيد التطوير، ويستهدف Windows 11 وPowerShell 7. بعض الخطوات تحتاج صلاحيات المسؤول، والنتيجة تختلف بحسب الجهاز والمشكلة.",
        },
      },
    ],
  },
  {
    slug: "personal-portfolio",
    title: { en: "This Website", ar: "هذا الموقع" },
    summary: {
      en: "My projects, background, and contact details in one place.",
      ar: "مشاريعي ونبذة عني ووسيلة التواصل معي في مكان واحد.",
    },
    category: { en: "Next.js · React · TypeScript", ar: "Next.js · React · TypeScript" },
    repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
    sections: [
      {
        title: { en: "The idea", ar: "الفكرة" },
        body: {
          en: "I wanted visitors to find my work and email me without digging through menus. That shaped the single-page layout.",
          ar: "أردت أن يجد الزائر مشاريعي وبريدي بسهولة، فجمعت الأساسيات في صفحة واحدة.",
        },
      },
      {
        title: { en: "The setup", ar: "كيف بنيته" },
        body: {
          en: "I built the site with Next.js and TypeScript. It has Arabic and English versions, uses Thmanyah Sans, and opens project details on the page.",
          ar: "بنيت الموقع بـ Next.js وTypeScript. يتوفر بالعربية والإنجليزية بخط ثمانية، وتفتح تفاصيل المشاريع داخل الصفحة.",
        },
      },
      {
        title: { en: "What I learned", ar: "ما تعلمته" },
        body: {
          en: "The site has gone through a few versions. Each one has helped me make the projects easier to find and the writing easier to read.",
          ar: "مرّ الموقع بأكثر من تصميم. ومع كل نسخة أراجع ترتيب المشاريع ونصوصها لتكون أوضح للزائر.",
        },
      },
    ],
  },
];

export const copy = {
  en: {
    focus: "I’m building a Windows maintenance toolkit and this site, and practising Java alongside them. They give me something concrete to learn from and improve.",
    nextStep: "I’m looking for an internship or junior role in software or AI. I’d also be glad to contribute to a project where I can keep learning.",
    biography: "I’m Adnan, a Computer Science and AI student at Arab Open University.",
    background: "Before moving into computing, I studied Human Medicine at Ain Shams University for two years. These projects are how I practise what I’m learning now.",
  },
  ar: {
    focus: "أعمل على أداة لصيانة Windows وهذا الموقع، وأتدرّب على Java إلى جانبهما. أتعلم من هذه المشاريع وأعود لتحسينها كلما اكتسبت مهارة جديدة.",
    nextStep: "أبحث عن تدريب أو وظيفة للمبتدئين، خصوصًا في البرمجة أو الذكاء الاصطناعي. ويسعدني أيضًا أن أساهم في مشروع أتعلم منه.",
    biography: "أنا عدنان، طالب علوم حاسوب وذكاء اصطناعي في الجامعة العربية المفتوحة.",
    background: "قبل الانتقال إلى الحوسبة، درست الطب البشري سنتين في جامعة عين شمس. أطبّق الآن ما أتعلمه في مشاريعي البرمجية.",
  },
} as const;
