import type { PublicData } from "@/types/public";

// Client-safe release projection. This module intentionally has no runtime imports
// from review data, so hidden or private literals cannot enter a client graph through it.
export const publicData = {
  profile: {
    displayName: "Adnan Naous",
    brand: "AN",
    primaryTitle: {
      en: "Computer Science Student",
      ar: "طالب علوم حاسوب",
    },
    supportingLabels: [
      { en: "Developer", ar: "مطوّر" },
      { en: "Technology Builder", ar: "صانع حلول تقنية" },
    ],
    location: {
      en: "Saudi Arabia",
      ar: "المملكة العربية السعودية",
    },
    shortBiography: {
      en: "Computer Science and Artificial Intelligence student interested in technology, AI, and programming.",
      ar: "طالب علوم حاسوب وذكاء اصطناعي مهتم بالتقنية والذكاء الاصطناعي والبرمجة.",
    },
    extendedBiography: {
      en: "A Computer Science and Artificial Intelligence student building practical software projects after previously studying Human Medicine. Currently focused on software development, continuous learning, experimentation, and building maintainable personal tools.",
      ar: "طالب في علوم الحاسوب والذكاء الاصطناعي، يبني مشاريع برمجية عملية بعد دراسة سابقة في الطب البشري. يركّز حاليًا على تطوير البرمجيات، والتعلم المستمر، والتجربة، وبناء أدوات شخصية قابلة للصيانة والتطوير.",
    },
    currentStatus: {
      en: "Studying Computer Science and Artificial Intelligence at Arab Open University.",
      ar: "يدرس علوم الحاسوب والذكاء الاصطناعي في الجامعة العربية المفتوحة.",
    },
    availability: {
      en: "Open to internships, collaborative learning projects, and entry-level software development opportunities.",
      ar: "منفتح على فرص التدريب ومشاريع التعلم التعاوني وفرص تطوير البرمجيات للمبتدئين.",
    },
    contacts: [
      {
        id: "public-email",
        type: "email",
        label: { en: "Email", ar: "البريد الإلكتروني" },
        value: "Adnan.Naous@outlook.com",
        href: "mailto:Adnan.Naous@outlook.com",
      },
      {
        id: "portfolio-site",
        type: "website",
        label: { en: "Website", ar: "الموقع" },
        value: "adnannaous.vercel.app",
        href: "https://adnannaous.vercel.app/",
      },
    ],
    socialProfiles: [
      {
        id: "github",
        label: "GitHub",
        handle: "AdnanNaous",
        url: "https://github.com/AdnanNaous",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        handle: "adnan-naous",
        url: "https://www.linkedin.com/in/adnan-naous/",
      },
      {
        id: "x",
        label: "X",
        handle: "aantrueman",
        url: "https://x.com/aantrueman",
      },
    ],
    profileImages: [
      {
        id: "current-abstract-profile",
        publicPath: "/profile.jpg",
        kind: "abstract",
        alt: {
          en: "Abstract monochrome orb representing Adnan Naous",
          ar: "كرة تجريدية أحادية اللون ترمز إلى عدنان نعوس",
        },
      },
      {
        id: "approved-portrait",
        publicPath: "/images/profile/adnan-naous-portrait.webp",
        kind: "portrait",
        alt: {
          en: "Portrait of Adnan Naous",
          ar: "صورة شخصية لعدنان نعوس",
        },
        width: 1600,
        height: 1600,
        format: "webp",
        approvalStatus: "user-approved",
        presentationVariants: {
          transparentCutout: {
            publicPath: "/images/profile/adnan-naous-portrait-cutout.webp",
            width: 1600,
            height: 1600,
            format: "webp",
            derivedFrom: "approved-portrait",
            processing: [
              "background-removal",
              "metadata-removal",
              "edge-refinement",
              "edge-decontamination",
            ],
          },
        },
      },
    ],
  },
  education: [
    {
      id: "aou-bsc-cs-ai",
      institution: "Arab Open University",
      program: "B.Sc. in Computer Science and Artificial Intelligence",
      field: "Computer Science and Artificial Intelligence",
      status: "in-progress",
      startYear: 2025,
      endYear: null,
      location: "Saudi Arabia",
      description: {
        en: "Current undergraduate study in computer science and artificial intelligence.",
        ar: "دراسة جامعية حالية في علوم الحاسوب والذكاء الاصطناعي.",
      },
    },
    {
      id: "ain-shams-human-medicine",
      institution: "Ain Shams University",
      program: "Undergraduate Studies in Human Medicine",
      field: "Human Medicine",
      status: "incomplete-study",
      startYear: 2023,
      endYear: 2025,
      location: "Egypt",
      description: {
        en: "Completed two years of undergraduate medical study. No degree or professional medical qualification was awarded.",
        ar: "أكمل سنتين من الدراسة الجامعية في الطب البشري دون الحصول على درجة أو مؤهل مهني طبي.",
      },
    },
  ],
  languages: [
    {
      id: "arabic",
      name: { en: "Arabic", ar: "العربية" },
      level: { en: "Native", ar: "اللغة الأم" },
    },
    {
      id: "english",
      name: { en: "English", ar: "الإنجليزية" },
      level: {
        en: "Working proficiency; used for university study, technical documentation, and development",
        ar: "كفاءة عملية؛ تُستخدم في الدراسة الجامعية والتوثيق التقني والتطوير",
      },
    },
  ],
  skills: [
    { id: "nextjs", name: "Next.js", kind: "framework", category: "used-in-projects", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 10 },
    { id: "react", name: "React", kind: "library", category: "used-in-projects", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 20 },
    { id: "typescript", name: "TypeScript", kind: "language", category: "used-in-projects", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 30 },
    { id: "tailwind-css", name: "Tailwind CSS", kind: "framework", category: "used-in-projects", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 40 },
    { id: "framer-motion", name: "Framer Motion", kind: "library", category: "used-in-projects", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 50 },
    { id: "git", name: "Git", kind: "tool", category: "development-tools", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 60 },
    { id: "github", name: "GitHub", kind: "platform", category: "development-tools", relatedProjectIds: ["personal-os-portfolio", "adnan-naous-journey", "ultimate-windows-maintenance"], displayPriority: 70 },
    { id: "vercel", name: "Vercel", kind: "cloud-service", category: "development-tools", relatedProjectIds: ["personal-os-portfolio"], displayPriority: 80 },
    { id: "programming-logic", name: "Programming Logic", kind: "concept", category: "currently-learning", relatedProjectIds: [], displayPriority: 90 },
    { id: "algorithms", name: "Algorithms", kind: "concept", category: "currently-learning", relatedProjectIds: [], displayPriority: 100 },
    { id: "artificial-intelligence-foundations", name: "Artificial Intelligence Foundations", kind: "concept", category: "currently-learning", relatedProjectIds: [], displayPriority: 110 },
    { id: "oubuild", name: "OUbuild", kind: "tool", category: "currently-learning", relatedProjectIds: [], displayPriority: 120 },
    {
      id: "windows-administration",
      name: "Windows System Maintenance & Troubleshooting",
      kind: "platform",
      category: "working-knowledge",
      relatedProjectIds: ["ultimate-windows-maintenance"],
      description: {
        en: "Practical Windows maintenance and troubleshooting supported by the Ultimate Windows Maintenance project and documented personal system work.",
        ar: "صيانة عملية لنظام Windows واستكشاف مشكلاته، مدعومة بمشروع Ultimate Windows Maintenance وأعمال شخصية موثقة على النظام.",
      },
      displayPriority: 140,
    },
  ],
  projects: [
    {
      id: "personal-os-portfolio",
      name: "Adnan Naous OS Website",
      shortLabel: "OS Website",
      description: {
        en: "A bilingual Next.js portfolio with a Personal OS dashboard, focus timer, command center, bookmarks, and GitHub activity view.",
        ar: "معرض أعمال ثنائي اللغة مبني باستخدام Next.js مع لوحة نظام شخصي ومؤقت تركيز ومركز أوامر وإشارات مرجعية وعرض لنشاط GitHub.",
      },
      visibility: "public",
      status: "maintained",
      category: "Web Application",
      technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
      liveUrl: "https://adnannaous.vercel.app/",
      featured: true,
      displayOrder: 10,
      placement: "main-projects",
      assets: [
        {
          id: "os-website-home-desktop",
          projectId: "personal-os-portfolio",
          kind: "website-screenshot",
          publicPath: "/images/projects/os-website-home-desktop.webp",
          width: 1440,
          height: 900,
          format: "webp",
          alt: {
            en: "Current desktop homepage showing the production navigation, Computer Science Student identity, and optical AI Core.",
            ar: "لقطة حالية للصفحة الرئيسية على سطح المكتب تُظهر تنقل الموقع وهوية طالب علوم الحاسوب ونواة الذكاء الاصطناعي البصرية.",
          },
          approvalStatus: "current-public-capture",
        },
        {
          id: "os-website-home-arabic-mobile",
          projectId: "personal-os-portfolio",
          kind: "mobile-screenshot",
          publicPath: "/images/projects/os-website-home-arabic-mobile.webp",
          width: 390,
          height: 844,
          format: "webp",
          alt: {
            en: "Current Arabic right-to-left mobile homepage with the optical AI Core and primary actions.",
            ar: "لقطة حالية للصفحة الرئيسية العربية على الهاتف باتجاه من اليمين إلى اليسار مع النواة البصرية والإجراءات الرئيسية.",
          },
          approvalStatus: "current-public-capture",
        },
        {
          id: "os-website-personal-os",
          projectId: "personal-os-portfolio",
          kind: "product-screenshot",
          publicPath: "/images/projects/os-website-personal-os.webp",
          width: 1440,
          height: 900,
          format: "webp",
          alt: {
            en: "Current Personal OS route showing the system map, focus timer, and command center.",
            ar: "لقطة حالية لمسار النظام الشخصي تُظهر مخطط النظام ومؤقت التركيز ومركز الأوامر.",
          },
          approvalStatus: "current-public-capture",
        },
        {
          id: "os-website-architecture",
          projectId: "personal-os-portfolio",
          kind: "architecture-diagram",
          publicPath: "/images/projects/os-website-architecture.svg",
          width: 1200,
          height: 720,
          format: "svg",
          alt: {
            en: "Architecture diagram showing the shared site shell, typed public data, server-rendered routes, route-local client features, and isolated Personal OS tools.",
            ar: "مخطط معماري يوضح إطار الموقع المشترك والبيانات العامة المقيّدة بالأنواع والمسارات المعروضة من الخادم وميزات العميل المحلية وأدوات النظام الشخصي المعزولة.",
          },
          approvalStatus: "locally-authored-public",
        },
      ],
      caseStudy: {
        purpose: {
          en: "Present verified public work and a practical Personal OS inside one maintainable bilingual product.",
          ar: "عرض العمل العام الموثق ونظام شخصي عملي داخل منتج ثنائي اللغة قابل للصيانة.",
        },
        context: {
          en: "The project is both this public portfolio and the runtime that hosts the Personal OS workspace.",
          ar: "المشروع هو معرض الأعمال العام نفسه وبيئة التشغيل التي تستضيف مساحة النظام الشخصي.",
        },
        problem: {
          en: "Portfolio information and personal productivity tools were separated across different surfaces.",
          ar: "كانت معلومات معرض الأعمال وأدوات الإنتاجية الشخصية موزعة على واجهات منفصلة.",
        },
        motivation: {
          en: "Create one maintainable bilingual home for public work and a practical Personal OS.",
          ar: "إنشاء مساحة ثنائية اللغة قابلة للصيانة تجمع العمل العام مع نظام شخصي عملي.",
        },
        solution: {
          en: "A unified Next.js website combining a portfolio, verified public content, and route-isolated productivity tools.",
          ar: "موقع موحّد مبني باستخدام Next.js يجمع معرض الأعمال والمحتوى العام الموثق وأدوات إنتاجية معزولة حسب المسار.",
        },
        architecture: {
          en: "Next.js App Router route groups, shared server-rendered layouts, typed public data, common optical tokens, and narrow client islands for interaction.",
          ar: "مجموعات مسارات Next.js App Router وتخطيطات مشتركة معروضة من الخادم وبيانات عامة مقيّدة بالأنواع ورموز بصرية مشتركة وجزر عميل ضيقة للتفاعل.",
        },
        constraints: [
          { en: "Keep English, Arabic, RTL, dark, and light presentation aligned.", ar: "الحفاظ على اتساق الإنجليزية والعربية واتجاه RTL والوضعين الداكن والفاتح." },
          { en: "Prevent review-only or private content from entering runtime imports.", ar: "منع محتوى المراجعة أو المحتوى الخاص من دخول استيرادات وقت التشغيل." },
          { en: "Load the Three.js AI Core only on the homepage.", ar: "تحميل نواة الذكاء الاصطناعي المبنية بـ Three.js في الصفحة الرئيسية فقط." },
        ],
        designDecisions: [
          { en: "One shared optical shell gives every public route a consistent identity.", ar: "يوفر إطار بصري مشترك هوية متسقة لكل المسارات العامة." },
          { en: "The AI Core is atmospheric; semantic content remains normal HTML.", ar: "نواة الذكاء الاصطناعي عنصر جوي بينما يبقى المحتوى الدلالي ضمن HTML عادي." },
        ],
        technicalDecisions: [
          { en: "Server Components own route content while client boundaries handle language, navigation, WebGL, and interactive tools.", ar: "تمتلك مكونات الخادم محتوى المسارات بينما تتولى حدود العميل اللغة والتنقل وWebGL والأدوات التفاعلية." },
          { en: "Dashboard state is scoped to /tools instead of wrapping the whole site.", ar: "تقتصر حالة لوحة التحكم على ‎/tools بدل تغليف الموقع كاملًا." },
          { en: "A validated publicData projection is the only approved client-safe factual source.", ar: "إسقاط publicData المتحقق منه هو المصدر الواقعي الوحيد المعتمد والآمن للعميل." },
        ],
        accessibilityAndPrivacy: [
          { en: "Keyboard navigation, visible focus, reduced motion, and non-WebGL fallback are preserved.", ar: "يتم الحفاظ على التنقل بلوحة المفاتيح والتركيز المرئي وتقليل الحركة والبديل غير المعتمد على WebGL." },
          { en: "Private review data and unpublished personal or academic fields remain outside public runtime content.", ar: "تبقى بيانات المراجعة الخاصة والحقول الشخصية أو الأكاديمية غير المنشورة خارج محتوى التشغيل العام." },
        ],
        challenges: [
          { en: "Avoiding hydration differences while theme and motion preferences initialize.", ar: "تجنب اختلافات hydration أثناء تهيئة السمة وتفضيلات الحركة." },
          { en: "Keeping legacy navigation and Three.js out of unrelated route bundles.", ar: "إبقاء التنقل القديم وThree.js خارج حزم المسارات غير المرتبطة." },
        ],
        keyFunctionality: [
          { en: "English and Arabic presentation", ar: "عرض باللغتين الإنجليزية والعربية" },
          { en: "Dark and light themes", ar: "وضعان داكن وفاتح" },
          { en: "Personal OS tools", ar: "أدوات النظام الشخصي" },
          { en: "Validated public content and static search records", ar: "محتوى عام متحقق منه وسجلات بحث ثابتة" },
        ],
        lessons: [
          { en: "Treating public content as a typed boundary reduces factual drift.", ar: "اعتماد حدود typed للمحتوى العام يقلل الانحراف في الحقائق." },
        ],
        limitations: [
          { en: "The contact action is email-based and has no application backend.", ar: "إجراء التواصل يعتمد على البريد ولا توجد له خلفية تطبيق." },
        ],
        roadmap: [
          { en: "Continue refining the Personal OS while preserving route-level performance.", ar: "متابعة تطوير النظام الشخصي مع الحفاظ على أداء كل مسار." },
        ],
        evidenceLinks: [
          {
            label: { en: "Public repository", ar: "المستودع العام" },
            href: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
            kind: "repository",
          },
          {
            label: { en: "Production website", ar: "الموقع المنشور" },
            href: "https://adnannaous.vercel.app/",
            kind: "live",
          },
        ],
      },
    },
    {
      id: "adnan-naous-journey",
      name: "Adnan Naous Journey",
      shortLabel: "Journey",
      description: {
        en: "A public repository for evidence-based learning notes, progress records, templates, and explicit authorship boundaries.",
        ar: "مستودع عام لملاحظات التعلّم القائمة على الأدلة وسجلات التقدم والقوالب وحدود التأليف الصريحة.",
      },
      visibility: "public",
      status: "active",
      category: "Learning Documentation",
      technologies: ["Markdown", "Git"],
      repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-Journey",
      liveUrl: null,
      featured: false,
      displayOrder: 20,
      placement: "main-projects",
      assets: [
        {
          id: "journey-evidence-workflow",
          projectId: "adnan-naous-journey",
          kind: "workflow-diagram",
          publicPath: "/images/projects/journey-evidence-workflow.svg",
          width: 1200,
          height: 720,
          format: "svg",
          alt: {
            en: "Workflow diagram showing source or original input, authorship separation, accuracy review, durable documentation, and evidence-based progress.",
            ar: "مخطط سير يوضح المصدر أو المدخل الأصلي وفصل التأليف ومراجعة الدقة والتوثيق المستدام والتقدم القائم على الدليل.",
          },
          approvalStatus: "locally-authored-public",
        },
        {
          id: "journey-repository-structure",
          projectId: "adnan-naous-journey",
          kind: "repository-structure",
          publicPath: "/images/projects/journey-repository-structure.svg",
          width: 1200,
          height: 720,
          format: "svg",
          alt: {
            en: "Repository tree showing the current learning, projects, challenges, notes, progress, resources, templates, and archive areas.",
            ar: "شجرة مستودع تعرض مساحات التعلم والمشاريع والتحديات والملاحظات والتقدم والموارد والقوالب والأرشيف الحالية.",
          },
          approvalStatus: "locally-authored-public",
        },
      ],
      caseStudy: {
        purpose: {
          en: "Build a durable, public record of learning without presenting generated or source-derived material as personal mastery.",
          ar: "بناء سجل عام ومستدام للتعلّم دون عرض المواد المولدة أو المأخوذة من المصادر كإتقان شخصي.",
        },
        context: {
          en: "An active computer science learning repository containing structured entries, progress records, templates, and explicit contribution rules.",
          ar: "مستودع نشط لتعلّم علوم الحاسوب يضم إدخالات منظمة وسجلات تقدم وقوالب وقواعد مساهمة صريحة.",
        },
        problem: {
          en: "Learning progress can become difficult to verify when notes and evidence are scattered.",
          ar: "يصعب التحقق من تقدم التعلّم عندما تكون الملاحظات والأدلة متفرقة.",
        },
        motivation: {
          en: "Keep a durable, evidence-based record of an evolving learning path.",
          ar: "الاحتفاظ بسجل مستدام قائم على الأدلة لمسار تعلّم متطور.",
        },
        solution: {
          en: "A public repository that organizes learning notes, progress records, and supporting evidence.",
          ar: "مستودع عام ينظم ملاحظات التعلّم وسجلات التقدم والأدلة الداعمة.",
        },
        architecture: {
          en: "Canonical learning, project, challenge, note, resource, and progress areas governed by an evidence and authorship protocol.",
          ar: "مساحات مرجعية للتعلّم والمشاريع والتحديات والملاحظات والموارد والتقدم تحكمها قواعد للدليل والتأليف.",
        },
        constraints: [
          { en: "Do not claim understanding, mastery, completion, or sources without evidence.", ar: "عدم ادعاء الفهم أو الإتقان أو الاكتمال أو المصادر دون دليل." },
          { en: "Keep small learning events proportional instead of inflating them into generic chapters.", ar: "إبقاء أحداث التعلّم الصغيرة متناسبة بدل تضخيمها إلى فصول عامة." },
        ],
        designDecisions: [
          { en: "Separate original input, faithful reconstruction, assessment, and academic explanation.", ar: "فصل المدخل الأصلي وإعادة الصياغة الأمينة والتقييم والشرح الأكاديمي." },
          { en: "Show uncertainty and corrections as part of the learning record.", ar: "إظهار عدم اليقين والتصحيحات كجزء من سجل التعلّم." },
        ],
        technicalDecisions: [
          { en: "Use repository-native Markdown, canonical folders, templates, and Git history as the durable system.", ar: "استخدام Markdown داخل المستودع والمجلدات المرجعية والقوالب وسجل Git كنظام مستدام." },
          { en: "Require action-specific approval before commit, push, merge, or deployment.", ar: "اشتراط موافقة خاصة بالإجراء قبل commit أو push أو merge أو النشر." },
        ],
        accessibilityAndPrivacy: [
          { en: "Public entries omit secrets, private conversations, and unnecessary personal identifiers.", ar: "تستبعد الإدخالات العامة الأسرار والمحادثات الخاصة والمعرفات الشخصية غير اللازمة." },
        ],
        challenges: [
          { en: "Preserving the learner's real contribution while still using AI for structure, translation, and review.", ar: "الحفاظ على مساهمة المتعلم الحقيقية مع استخدام الذكاء الاصطناعي للتنظيم والترجمة والمراجعة." },
        ],
        keyFunctionality: [
          { en: "Structured learning records", ar: "سجلات تعلّم منظمة" },
          { en: "Evidence-aware documentation", ar: "توثيق واعٍ بالأدلة" },
        ],
        lessons: [
          { en: "Separating evidence from interpretation makes progress records more credible.", ar: "فصل الأدلة عن التفسير يجعل سجلات التقدم أكثر موثوقية." },
        ],
        limitations: [
          { en: "The repository represents an ongoing journey rather than a completed curriculum.", ar: "يمثل المستودع رحلة مستمرة وليس منهجًا مكتملًا." },
        ],
        roadmap: [
          { en: "Add verified learning records as work is completed.", ar: "إضافة سجلات تعلّم موثقة عند اكتمال العمل." },
        ],
        evidenceLinks: [
          {
            label: { en: "Public repository", ar: "المستودع العام" },
            href: "https://github.com/AdnanNaous/Adnan-Naous-Journey",
            kind: "repository",
          },
        ],
      },
    },
    {
      id: "ultimate-windows-maintenance",
      name: "Ultimate Windows Maintenance",
      shortLabel: "Windows Tools",
      description: {
        en: "An in-progress modular PowerShell toolkit for inspectable, safety-first Windows 11 maintenance and reporting.",
        ar: "حزمة PowerShell معيارية قيد التطوير لصيانة Windows 11 وإعداد التقارير بأسلوب قابل للفحص يضع الأمان أولًا.",
      },
      visibility: "public",
      status: "in-progress",
      category: "Automation",
      technologies: ["PowerShell"],
      repositoryUrl: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
      liveUrl: null,
      featured: false,
      displayOrder: 30,
      placement: "main-projects",
      assets: [
        {
          id: "windows-maintenance-safety-flow",
          projectId: "ultimate-windows-maintenance",
          kind: "system-diagram",
          publicPath: "/images/projects/windows-maintenance-safety-flow.svg",
          width: 1200,
          height: 720,
          format: "svg",
          alt: {
            en: "System flow diagram showing configuration, safety checkpoint, diagnostics, selected maintenance modules, and generated reports.",
            ar: "مخطط نظام يوضح الإعداد ونقطة الأمان والتشخيص ووحدات الصيانة المختارة والتقارير الناتجة.",
          },
          approvalStatus: "locally-authored-public",
        },
        {
          id: "windows-maintenance-repository-structure",
          projectId: "ultimate-windows-maintenance",
          kind: "repository-structure",
          publicPath: "/images/projects/windows-maintenance-repository-structure.svg",
          width: 1200,
          height: 720,
          format: "svg",
          alt: {
            en: "Repository map showing the PowerShell entry point, configuration, focused maintenance modules, and local report output.",
            ar: "خريطة مستودع تعرض نقطة تشغيل PowerShell والإعداد ووحدات الصيانة المركزة ومخرجات التقارير المحلية.",
          },
          approvalStatus: "locally-authored-public",
        },
      ],
      caseStudy: {
        purpose: {
          en: "Make Windows 11 maintenance tasks more inspectable, modular, and explicit through PowerShell.",
          ar: "جعل مهام صيانة Windows 11 أكثر قابلية للفحص والتنظيم والوضوح باستخدام PowerShell.",
        },
        context: {
          en: "A public PowerShell toolkit with separate health, cleanup, repair, update, security, driver, helper, and reporting modules.",
          ar: "حزمة PowerShell عامة تحتوي وحدات منفصلة للصحة والتنظيف والإصلاح والتحديث والأمان والتعريفات والمساعدة والتقارير.",
        },
        problem: {
          en: "Windows maintenance workflows can become risky when they are broad, opaque, or difficult to reverse.",
          ar: "قد تصبح عمليات صيانة Windows خطرة عندما تكون واسعة أو غير واضحة أو صعبة التراجع.",
        },
        motivation: {
          en: "Develop a conservative maintenance workflow centered on inspection and user control.",
          ar: "تطوير سير صيانة محافظ يركز على الفحص وتحكم المستخدم.",
        },
        solution: {
          en: "An in-progress PowerShell toolkit for safety-first Windows maintenance and troubleshooting.",
          ar: "حزمة PowerShell قيد التطوير لصيانة Windows واستكشاف مشكلاته مع أولوية الأمان.",
        },
        architecture: {
          en: "A configuration-driven orchestrator imports focused PowerShell modules, optionally creates a restore point, runs selected tasks, and exports reports.",
          ar: "منسق يعتمد على الإعداد يستورد وحدات PowerShell مركزة وينشئ نقطة استعادة اختياريًا ويشغل المهام المحددة ويصدر التقارير.",
        },
        constraints: [
          { en: "Administrator privileges and PowerShell 7 are required.", ar: "يتطلب صلاحيات المسؤول وPowerShell 7." },
          { en: "Maintenance operations can take time, require a saved-work warning, and cannot guarantee performance improvement.", ar: "قد تستغرق عمليات الصيانة وقتًا وتتطلب تنبيهًا لحفظ العمل ولا تضمن تحسين الأداء." },
        ],
        designDecisions: [
          { en: "Keep health, cleanup, repair, update, security, driver, and reporting responsibilities in separate modules.", ar: "إبقاء مسؤوليات الصحة والتنظيف والإصلاح والتحديث والأمان والتعريفات والتقارير في وحدات منفصلة." },
          { en: "Create a system restore checkpoint by default unless the user explicitly skips it.", ar: "إنشاء نقطة استعادة للنظام افتراضيًا ما لم يتجاوزها المستخدم صراحة." },
        ],
        technicalDecisions: [
          { en: "Use SFC and DISM for supported Windows image and system-file repair workflows.", ar: "استخدام SFC وDISM لسير إصلاح صورة Windows وملفات النظام المدعوم." },
          { en: "Generate JSON, text, and HTML reports to make each run inspectable.", ar: "إنشاء تقارير JSON ونص وHTML لجعل كل تشغيل قابلًا للفحص." },
        ],
        accessibilityAndPrivacy: [
          { en: "Reports remain local to the user's machine; the portfolio does not upload or process them.", ar: "تبقى التقارير محليًا على جهاز المستخدم ولا يرفعها معرض الأعمال أو يعالجها." },
        ],
        challenges: [
          { en: "Handling locked files, long-running system commands, and partial failures without hiding uncertainty.", ar: "التعامل مع الملفات المقفلة وأوامر النظام طويلة التشغيل والإخفاقات الجزئية دون إخفاء عدم اليقين." },
        ],
        keyFunctionality: [
          { en: "OS, disk, memory, and critical-event diagnostics", ar: "تشخيص نظام التشغيل والقرص والذاكرة والأحداث الحرجة" },
          { en: "Temporary-file, cache, update-cache, and recycle-bin cleanup", ar: "تنظيف الملفات المؤقتة وذاكرة التخزين المؤقت وذاكرة تحديثات Windows وسلة المحذوفات" },
          { en: "SFC, DISM, Windows Update, package, Defender, and driver checks", ar: "فحوصات SFC وDISM وWindows Update والحزم وDefender والتعريفات" },
          { en: "JSON, text, and HTML maintenance reports", ar: "تقارير صيانة بصيغ JSON والنص وHTML" },
        ],
        lessons: [
          { en: "Maintenance automation must preserve user control and report uncertainty.", ar: "يجب أن تحافظ أتمتة الصيانة على تحكم المستخدم وأن توضح عدم اليقين." },
        ],
        limitations: [
          { en: "The toolkit is in progress, targets Windows 11, requires elevated privileges, and is not a universal or risk-free repair system.", ar: "الحزمة قيد التطوير وتستهدف Windows 11 وتتطلب صلاحيات مرتفعة وليست نظام إصلاح شاملًا أو خاليًا من المخاطر." },
        ],
        roadmap: [
          { en: "Expand verified diagnostics without broadening destructive behavior.", ar: "توسيع التشخيصات الموثقة دون توسيع السلوكيات التدميرية." },
        ],
        evidenceLinks: [
          {
            label: { en: "Public repository", ar: "المستودع العام" },
            href: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
            kind: "repository",
          },
        ],
      },
    },
    {
      id: "first-ai-project",
      name: "Adnan Naous AI - First Project",
      shortLabel: "First AI Project",
      description: {
        en: "A public JavaScript learning repository identified as a first AI project and not presented as completed.",
        ar: "مستودع JavaScript عام للتعلم وُصف بأنه أول مشروع في الذكاء الاصطناعي ولا يُعرض كمشروع مكتمل.",
      },
      visibility: "public",
      status: "paused",
      category: "Learning Project",
      technologies: ["JavaScript"],
      repositoryUrl: "https://github.com/AdnanNaous/adnan-naous-ai-not-working--my-first-project-ever",
      liveUrl: null,
      featured: false,
      displayOrder: 40,
      placement: "github-gallery-learning-journey",
      assets: [],
    },
    {
      id: "godot-workshop-prototype",
      name: "Godot Workshop Prototype",
      shortLabel: "Godot Prototype",
      description: {
        en: "A basic prototype reported as built during a three-day Godot workshop; the issuer remains unconfirmed.",
        ar: "نموذج أولي بسيط ذُكر أنه بُني خلال ورشة Godot لمدة ثلاثة أيام، ولا تزال الجهة المنظمة غير مؤكدة.",
      },
      visibility: "public",
      status: "functional-prototype",
      category: "Game Development",
      technologies: ["Godot Engine"],
      repositoryUrl: null,
      liveUrl: null,
      featured: false,
      displayOrder: 50,
      placement: "github-gallery-learning-journey",
      assets: [],
    },
  ],
  github: {
    owner: "AdnanNaous",
    profileUrl: "https://github.com/AdnanNaous",
    repositories: [
      {
        id: "adnan-naous-journey",
        displayName: "Adnan Naous Journey",
        shortLabel: "Journey",
        repositoryName: "Adnan-Naous-Journey",
        owner: "AdnanNaous",
        repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-Journey",
        summary: {
          en: "Learning journey",
          ar: "رحلة التعلّم",
        },
        visibility: "public",
        category: "Learning Documentation",
        description: {
          en: "A public repository for evidence-based learning notes and progress records.",
          ar: "مستودع عام لملاحظات التعلّم وسجلات التقدم المبنية على الأدلة.",
        },
        liveDeploymentUrl: null,
        tags: ["learning", "documentation", "progress"],
        featured: true,
        displayOrder: 10,
      },
      {
        id: "personal-os-portfolio",
        displayName: "Adnan Naous OS Website",
        shortLabel: "OS Website",
        repositoryName: "Adnan-Naous-OS-website",
        owner: "AdnanNaous",
        repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
        summary: {
          en: "Personal knowledge system",
          ar: "نظام معرفة شخصي",
        },
        visibility: "public",
        category: "Portfolio and Personal OS",
        description: {
          en: "Bilingual portfolio and Personal OS built with Next.js and TypeScript.",
          ar: "معرض أعمال ونظام شخصي ثنائي اللغة مبني باستخدام Next.js وTypeScript.",
        },
        liveDeploymentUrl: "https://adnannaous.vercel.app/",
        tags: ["nextjs", "typescript", "portfolio", "personal-os"],
        featured: true,
        displayOrder: 20,
      },
      {
        id: "ultimate-windows-maintenance",
        displayName: "Ultimate Windows Maintenance",
        shortLabel: "Windows Tools",
        repositoryName: "Ultimate-Windows-Maintenance",
        owner: "AdnanNaous",
        repositoryUrl: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
        summary: {
          en: "Maintenance toolkit",
          ar: "حزمة أدوات الصيانة",
        },
        visibility: "public",
        category: "Automation",
        description: {
          en: "A public PowerShell repository for a safety-first Windows maintenance workflow.",
          ar: "مستودع PowerShell عام لسير عمل صيانة Windows مع التركيز على الأمان.",
        },
        liveDeploymentUrl: null,
        tags: ["powershell", "windows", "maintenance"],
        featured: true,
        displayOrder: 30,
      },
      {
        id: "first-ai-project",
        displayName: "Adnan Naous AI - First Project",
        shortLabel: "First AI Project",
        repositoryName: "adnan-naous-ai-not-working--my-first-project-ever",
        owner: "AdnanNaous",
        repositoryUrl: "https://github.com/AdnanNaous/adnan-naous-ai-not-working--my-first-project-ever",
        summary: {
          en: "First AI learning project",
          ar: "أول مشروع تعلّم في الذكاء الاصطناعي",
        },
        visibility: "public",
        category: "Learning Project",
        description: null,
        liveDeploymentUrl: null,
        tags: ["javascript", "learning", "ai"],
        featured: false,
        displayOrder: 40,
      },
    ],
  },
  credentials: [
    {
      id: "kanz-ai-hackathon-2026",
      title: "Kanz AI Hackathon",
      shortLabel: "Certificate",
      summary: {
        en: "AI Training Hackathon · 2026",
        ar: "هاكاثون تدريب الذكاء الاصطناعي · 2026",
      },
      credentialType: "Certificate of Workshop Completion",
      program: "AI Training Hackathon",
      completionDate: "2026-07-15",
      featuredProject: "Adnan OS: A Command Center for the Modern CS Student",
      credentialId: "KANZ-ADV-0594",
      issuer: "Kanz AI",
      documentPath: "/documents/certificates/kanz-ai-hackathon-2026.pdf",
      preview: {
        publicPath: "/images/projects/kanz-ai-certificate.webp",
        width: 1871,
        height: 1323,
        format: "webp",
        alt: {
          en: "Preview of the Kanz AI Hackathon certificate of workshop completion issued to Adnan Naous.",
          ar: "معاينة لشهادة إتمام ورشة Kanz AI Hackathon الصادرة لعدنان نعوس.",
        },
        approvalStatus: "rendered-approved-public-document",
      },
      visibility: "public",
      verificationStatus: "user-confirmed",
    },
  ],
  homepage: {
    dock: [
      { kind: "repository", recordId: "adnan-naous-journey", icon: "journey" },
      { kind: "repository", recordId: "personal-os-portfolio", icon: "os-website" },
      { kind: "repository", recordId: "ultimate-windows-maintenance", icon: "windows-tools" },
      { kind: "credential", recordId: "kanz-ai-hackathon-2026", icon: "certificate" },
    ],
    statement: {
      en: "Building practical systems with evidence, restraint, and intent.",
      ar: "بناء أنظمة عملية قائمة على الدليل والانضباط والهدف.",
    },
    principles: [
      {
        id: "truthful",
        title: { en: "Truthful by design", ar: "الصدق في التصميم" },
        description: { en: "Public claims stay connected to approved evidence.", ar: "تبقى الادعاءات العامة مرتبطة بأدلة معتمدة." },
      },
      {
        id: "maintainable",
        title: { en: "Built to maintain", ar: "مصمم للصيانة" },
        description: { en: "Clear boundaries keep content and interfaces easier to evolve.", ar: "تجعل الحدود الواضحة المحتوى والواجهات أسهل في التطوير." },
      },
      {
        id: "practical",
        title: { en: "Practical learning", ar: "تعلّم عملي" },
        description: { en: "Study becomes visible through projects, tools, and documentation.", ar: "يظهر التعلّم عبر المشاريع والأدوات والتوثيق." },
      },
    ],
    mission: {
      eyebrow: { en: "Current mission", ar: "المهمة الحالية" },
      title: {
        en: "Turn focused learning into useful, inspectable software.",
        ar: "تحويل التعلّم المركّز إلى برمجيات مفيدة وقابلة للفحص.",
      },
      description: {
        en: "The work connects three threads: building a maintainable public system, documenting learning with evidence, and developing safer personal automation.",
        ar: "يربط العمل بين ثلاثة مسارات: بناء نظام عام قابل للصيانة، وتوثيق التعلّم بالدليل، وتطوير أتمتة شخصية أكثر أمانًا.",
      },
    },
    featuredProjectId: "personal-os-portfolio",
    verifiedProjectIds: [
      "personal-os-portfolio",
      "adnan-naous-journey",
      "ultimate-windows-maintenance",
    ],
    process: [
      {
        id: "inspect",
        title: { en: "Inspect reality", ar: "فحص الواقع" },
        description: { en: "Start from the repository, constraints, and available evidence.", ar: "البدء من المستودع والقيود والأدلة المتاحة." },
      },
      {
        id: "structure",
        title: { en: "Define boundaries", ar: "تحديد الحدود" },
        description: { en: "Separate public facts, private review data, server content, and interactive client work.", ar: "فصل الحقائق العامة وبيانات المراجعة الخاصة ومحتوى الخادم والعمل التفاعلي على العميل." },
      },
      {
        id: "build",
        title: { en: "Build the smallest system", ar: "بناء أصغر نظام" },
        description: { en: "Implement only the architecture and interface needed for the verified goal.", ar: "تنفيذ المعمارية والواجهة اللازمتين فقط للهدف الموثق." },
      },
      {
        id: "verify",
        title: { en: "Validate proportionally", ar: "التحقق بتناسب" },
        description: { en: "Use lint, types, builds, browser checks, and content validation according to risk.", ar: "استخدام lint والأنواع والبناء وفحوصات المتصفح والمحتوى بحسب المخاطر." },
      },
      {
        id: "document",
        title: { en: "Record limits", ar: "توثيق القيود" },
        description: { en: "State what works, what remains uncertain, and what should happen next.", ar: "توضيح ما يعمل وما يبقى غير مؤكد وما ينبغي فعله لاحقًا." },
      },
    ],
    personalOSPreview: {
      title: { en: "A workspace, not a dashboard decoration.", ar: "مساحة عمل وليست زينة لوحة تحكم." },
      description: {
        en: "The Personal OS combines a focus timer, keyboard command center, public GitHub activity, and a curated resource library within a route-scoped workspace.",
        ar: "يجمع النظام الشخصي مؤقت تركيز ومركز أوامر بلوحة المفاتيح ونشاط GitHub العام ومكتبة موارد منسقة ضمن مساحة عمل معزولة بالمسار.",
      },
      moduleIds: ["focus-timer", "command-center", "github-activity", "resource-library"],
    },
    opportunity: {
      title: {
        en: "Looking for a place where careful learning can become useful contribution.",
        ar: "أبحث عن مساحة يتحول فيها التعلّم الدقيق إلى مساهمة مفيدة.",
      },
      description: {
        en: "Open to internships, entry-level software opportunities, collaborative learning projects, and appropriate open-source or student work.",
        ar: "منفتح على التدريب وفرص البرمجيات للمبتدئين ومشاريع التعلّم التعاوني والعمل المناسب مفتوح المصدر أو الطلابي.",
      },
    },
  },
  navigation: {
    primary: [
      { href: "/", label: { en: "Home", ar: "الرئيسية" } },
      { href: "/portfolio", label: { en: "Portfolio", ar: "الأعمال" } },
      { href: "/about", label: { en: "About", ar: "عني" } },
      { href: "/contact", label: { en: "Contact", ar: "تواصل" } },
      { href: "/tools", label: { en: "Personal OS", ar: "النظام الشخصي" } },
    ],
    secondary: [
      { href: "/services", label: { en: "Capabilities", ar: "القدرات" } },
      { href: "/blog", label: { en: "Writing", ar: "الكتابة" } },
      { href: "/testimonials", label: { en: "Recognition", ar: "التقدير" } },
    ],
  },
  capabilities: [
    {
      id: "software",
      title: { en: "Personal software systems", ar: "أنظمة برمجية شخصية" },
      description: { en: "Building maintainable web interfaces and focused tools from typed content and clear boundaries.", ar: "بناء واجهات ويب وأدوات مركزة قابلة للصيانة انطلاقًا من محتوى typed وحدود واضحة." },
      evidenceProjectIds: ["personal-os-portfolio"],
      status: "demonstrated",
      boundaries: [
        { en: "Demonstrated through personal public projects; no client-delivery history is claimed.", ar: "مثبت عبر مشاريع شخصية عامة دون ادعاء سجل تسليم لعملاء." },
      ],
    },
    {
      id: "learning",
      title: { en: "Learning documentation", ar: "توثيق التعلّم" },
      description: { en: "Organizing progress and evidence into durable public records.", ar: "تنظيم التقدم والأدلة في سجلات عامة مستدامة." },
      evidenceProjectIds: ["adnan-naous-journey"],
      status: "demonstrated",
      boundaries: [
        { en: "The repository records ongoing learning and does not claim curriculum completion or mastery.", ar: "يسجل المستودع تعلّمًا مستمرًا ولا يدعي إكمال منهج أو إتقانًا." },
      ],
    },
    {
      id: "windows",
      title: { en: "Windows maintenance & troubleshooting", ar: "صيانة Windows واستكشاف المشكلات" },
      description: { en: "Developing conservative diagnostics and approval-aware maintenance workflows.", ar: "تطوير تشخيصات محافظة وسير صيانة يراعي الموافقة." },
      evidenceProjectIds: ["ultimate-windows-maintenance"],
      status: "developing",
      boundaries: [
        { en: "The toolkit is in progress, Windows 11-specific, and not presented as guaranteed or risk-free repair.", ar: "الحزمة قيد التطوير ومخصصة لـ Windows 11 ولا تُعرض كإصلاح مضمون أو خالٍ من المخاطر." },
      ],
    },
  ],
  about: {
    transition: {
      en: "Previous undergraduate study in Human Medicine developed an early habit of structured observation. That study ended without a degree or medical qualification; the path then moved toward Computer Science and Artificial Intelligence, where the same discipline now supports software projects and evidence-based learning.",
      ar: "طورت الدراسة الجامعية السابقة في الطب البشري عادة مبكرة في الملاحظة المنظمة. انتهت تلك الدراسة دون درجة أو مؤهل طبي، ثم انتقل المسار إلى علوم الحاسوب والذكاء الاصطناعي حيث يدعم الانضباط نفسه المشاريع البرمجية والتعلّم القائم على الدليل.",
    },
    currentFocus: [
      {
        id: "software-development",
        title: { en: "Software development", ar: "تطوير البرمجيات" },
        description: { en: "Building maintainable web interfaces and focused personal tools.", ar: "بناء واجهات ويب قابلة للصيانة وأدوات شخصية مركزة." },
      },
      {
        id: "computer-science",
        title: { en: "Computer science foundations", ar: "أساسيات علوم الحاسوب" },
        description: { en: "Studying programming logic, algorithms, systems, and software engineering foundations.", ar: "دراسة منطق البرمجة والخوارزميات والأنظمة وأساسيات هندسة البرمجيات." },
      },
      {
        id: "responsible-ai",
        title: { en: "Responsible AI-assisted work", ar: "العمل المسؤول بمساعدة الذكاء الاصطناعي" },
        description: { en: "Using AI for structure and review without replacing evidence, authorship, or validation.", ar: "استخدام الذكاء الاصطناعي للتنظيم والمراجعة دون استبدال الدليل أو التأليف أو التحقق." },
      },
    ],
    workingPrinciples: [
      { id: "evidence-first", title: { en: "Evidence before appearance", ar: "الدليل قبل المظهر" }, description: { en: "Claims stay proportional to repositories, documents, and validated behavior.", ar: "تبقى الادعاءات متناسبة مع المستودعات والوثائق والسلوك المتحقق منه." } },
      { id: "scope", title: { en: "Clear scope", ar: "نطاق واضح" }, description: { en: "Large ideas are divided into reviewable, reversible phases.", ar: "تُقسم الأفكار الكبيرة إلى مراحل قابلة للمراجعة والتراجع." } },
      { id: "maintenance", title: { en: "Maintainable systems", ar: "أنظمة قابلة للصيانة" }, description: { en: "Content, runtime behavior, and presentation receive explicit boundaries.", ar: "يحصل المحتوى وسلوك التشغيل والعرض على حدود صريحة." } },
    ],
  },
  writing: {
    status: {
      en: "No public articles are published yet. This space will hold evidence-based notes when they are ready.",
      ar: "لا توجد مقالات عامة منشورة حاليًا. ستضم هذه المساحة ملاحظات قائمة على الأدلة عندما تصبح جاهزة.",
    },
    topics: [
      { id: "learning-systems", title: { en: "Learning systems", ar: "أنظمة التعلّم" }, description: { en: "How structure and evidence improve a long-term learning record.", ar: "كيف يحسن التنظيم والدليل سجل التعلّم طويل المدى." } },
      { id: "personal-tools", title: { en: "Personal tools", ar: "الأدوات الشخصية" }, description: { en: "Notes from building software for focused personal workflows.", ar: "ملاحظات من بناء برمجيات لسير عمل شخصي مركز." } },
      { id: "safe-automation", title: { en: "Safe automation", ar: "الأتمتة الآمنة" }, description: { en: "Principles for transparent and reversible system maintenance.", ar: "مبادئ لصيانة أنظمة واضحة وقابلة للتراجع." } },
    ],
    editorialPrinciples: [
      { en: "Publish only after the underlying work or learning record exists.", ar: "النشر فقط بعد وجود العمل أو سجل التعلّم الأساسي." },
      { en: "Separate personal understanding, source material, and technical explanation.", ar: "فصل الفهم الشخصي ومادة المصدر والشرح التقني." },
      { en: "Prefer durable notes over artificial publishing frequency.", ar: "تفضيل الملاحظات المستدامة على وتيرة نشر مصطنعة." },
    ],
    articles: [],
  },
  recognition: {
    statement: {
      en: "No public endorsements are currently published. Only verified credentials are presented.",
      ar: "لا توجد تزكيات عامة منشورة حاليًا. تُعرض فقط المؤهلات الموثقة.",
    },
    context: {
      en: "The current public evidence is a workshop-completion certificate from the Kanz AI Training Hackathon. It is not presented as a degree, license, employment credential, award, or broad AI certification.",
      ar: "الدليل العام الحالي هو شهادة إكمال ورشة من هاكاثون Kanz AI التدريبي. لا تُعرض كدرجة أو رخصة أو مؤهل وظيفي أو جائزة أو شهادة واسعة في الذكاء الاصطناعي.",
    },
  },
  contact: {
    introduction: {
      en: "A direct place to discuss internships, collaborative learning, and entry-level software opportunities.",
      ar: "مساحة مباشرة لمناقشة فرص التدريب والتعلّم التعاوني وفرص البرمجيات للمبتدئين.",
    },
    opportunityTypes: [
      { en: "Internships", ar: "التدريب" },
      { en: "Collaborative learning projects", ar: "مشاريع التعلّم التعاوني" },
      { en: "Entry-level software development", ar: "تطوير البرمجيات للمبتدئين" },
      { en: "Appropriate open-source or student projects", ar: "مشاريع مناسبة مفتوحة المصدر أو طلابية" },
      { en: "Technical or research-oriented student discussions", ar: "نقاشات طلابية تقنية أو موجهة للبحث" },
    ],
    contributionTypes: [
      { en: "Careful frontend implementation and responsive interface work", ar: "تنفيذ واجهات أمامية دقيق وعمل متجاوب" },
      { en: "Typed content systems, documentation, and repository organization", ar: "أنظمة محتوى مقيّدة بالأنواع وتوثيق وتنظيم المستودعات" },
      { en: "Testing, issue investigation, and maintenance-focused improvements", ar: "اختبار وتحقيق في المشكلات وتحسينات تركز على الصيانة" },
    ],
    collaborationPreferences: [
      { en: "Clear scope, honest expectations, and reviewable milestones", ar: "نطاق واضح وتوقعات صادقة ومراحل قابلة للمراجعة" },
      { en: "Opportunities that support learning, contribution, and constructive feedback", ar: "فرص تدعم التعلّم والمساهمة والتغذية الراجعة البنّاءة" },
    ],
    limitations: [
      { en: "No client portfolio, commercial service history, or guaranteed availability is claimed.", ar: "لا يُدعى وجود سجل عملاء أو خدمات تجارية أو توافر مضمون." },
      { en: "The website uses mail links and does not submit or store contact messages.", ar: "يستخدم الموقع روابط البريد ولا يرسل رسائل التواصل أو يخزنها." },
    ],
    responseNote: {
      en: "Email opens your mail application. This website does not submit or store messages.",
      ar: "يفتح البريد تطبيق المراسلة لديك. لا يرسل هذا الموقع الرسائل ولا يخزنها.",
    },
  },
  personalOS: {
    title: { en: "Personal OS", ar: "النظام الشخصي" },
    introduction: {
      en: "A focused workspace of locally built and carefully integrated productivity tools.",
      ar: "مساحة عمل مركزة تضم أدوات إنتاجية مبنية محليًا ومتكاملة بعناية.",
    },
    productStory: {
      en: "The Personal OS brings together focus, navigation, activity, and resource tools in one workspace while keeping dashboard state isolated from the rest of the site.",
      ar: "يجمع النظام الشخصي أدوات التركيز والتنقل والنشاط والموارد في مساحة واحدة، مع إبقاء حالة لوحة التحكم معزولة عن بقية الموقع.",
    },
    tools: [
      {
        id: "focus-timer", title: { en: "Focus timer", ar: "مؤقت التركيز" }, description: { en: "A locally built focus and break timer.", ar: "مؤقت محلي لفترات التركيز والاستراحة." }, implementation: "built", status: "functional",
        behavior: { en: "Starts, pauses, resets, and transitions between focus and break sessions.", ar: "يبدأ ويوقف ويعيد الضبط وينتقل بين جلسات التركيز والاستراحة." },
        limitation: { en: "Timer state is local to the current browser session.", ar: "حالة المؤقت محلية لجلسة المتصفح الحالية." },
        privacy: { en: "No timer history is sent to a server.", ar: "لا يُرسل سجل المؤقت إلى خادم." },
      },
      {
        id: "command-center", title: { en: "Command center", ar: "مركز الأوامر" }, description: { en: "A locally built keyboard-first launcher for selected destinations.", ar: "مشغّل محلي يعتمد على لوحة المفاتيح للوصول إلى وجهات محددة." }, implementation: "built", status: "functional",
        behavior: { en: "Filters approved commands and supports a keyboard shortcut, input focus, and predictable Escape behavior.", ar: "يرشح الأوامر المعتمدة ويدعم اختصار لوحة المفاتيح وتركيز الإدخال وسلوك Escape متوقع." },
        limitation: { en: "Commands navigate or update local interface state; this is not a system shell.", ar: "تتنقل الأوامر أو تحدث حالة الواجهة المحلية وليست shell للنظام." },
        privacy: { en: "Queries remain in the current interface and are not submitted remotely.", ar: "تبقى الاستعلامات في الواجهة الحالية ولا تُرسل عن بعد." },
      },
      {
        id: "github-activity", title: { en: "GitHub activity", ar: "نشاط GitHub" }, description: { en: "An integrated public activity calendar for the approved GitHub profile.", ar: "تقويم نشاط عام متكامل لملف GitHub المعتمد." }, implementation: "integrated", status: "functional",
        behavior: { en: "Displays public contribution activity for the approved GitHub username.", ar: "يعرض نشاط المساهمات العام لاسم مستخدم GitHub المعتمد." },
        limitation: { en: "Availability and accuracy depend on the public third-party activity source.", ar: "يعتمد التوفر والدقة على مصدر النشاط العام الخارجي." },
        privacy: { en: "Only public profile activity is requested; no GitHub token is stored in this dataset.", ar: "يُطلب نشاط الملف العام فقط ولا يُخزن رمز GitHub في هذه البيانات." },
      },
      {
        id: "resource-library", title: { en: "Resource library", ar: "مكتبة الموارد" }, description: { en: "A curated view of approved public resources.", ar: "عرض منسق للموارد العامة المعتمدة." }, implementation: "built", status: "functional",
        behavior: { en: "Filters and opens 19 approved public resources, including a 12-item featured view.", ar: "يرشح ويفتح 19 موردًا عامًا معتمدًا، منها عرض مميز يضم 12 عنصرًا." },
        limitation: { en: "Resources are curated links, not endorsements or an objective ranking.", ar: "الموارد روابط منسقة وليست تزكيات أو ترتيبًا موضوعيًا." },
        privacy: { en: "Private bookmarks, university portals, dashboards, and raw exports are excluded.", ar: "تُستبعد الإشارات الخاصة وبوابات الجامعة ولوحات التحكم والملفات الخام." },
      },
    ],
  },
  footer: {
    statement: {
      en: "Built and maintained as a truthful record of learning and practical work.",
      ar: "بُني ويُصان كسجل صادق للتعلّم والعمل العملي.",
    },
  },
  bookmarks: [
    { id: "github", name: "GitHub", canonicalUrl: "https://github.com/", description: { en: "Code hosting and collaboration platform used for the public project repositories." }, category: "Development", tags: ["git", "repositories", "collaboration"], featured: true, displayOrder: 10, audience: ["everyone", "developers", "students"], validationStatus: "valid" },
    { id: "google-ai-studio", name: "Google AI Studio", canonicalUrl: "https://aistudio.google.com/", description: { en: "Google's browser-based environment for experimenting with generative AI models." }, category: "AI & Machine Learning", tags: ["ai", "models", "prototyping", "google"], featured: true, displayOrder: 50, audience: ["ai-learners", "developers"], validationStatus: "requires-login" },
    { id: "hugging-face", name: "Hugging Face", canonicalUrl: "https://huggingface.co/", description: { en: "Platform for machine-learning models, datasets, demos, and research resources." }, category: "AI & Machine Learning", tags: ["ai", "machine-learning", "models", "datasets"], featured: true, displayOrder: 60, audience: ["ai-learners", "developers", "students"], validationStatus: "valid" },
    { id: "docker", name: "Docker", canonicalUrl: "https://www.docker.com/", description: { en: "Container platform and development tooling." }, category: "Deployment & Backend", tags: ["containers", "devops", "deployment"], featured: true, displayOrder: 70, audience: ["developers"], validationStatus: "valid" },
    { id: "openrouter", name: "OpenRouter", canonicalUrl: "https://openrouter.ai/", description: { en: "Unified access layer for supported AI model providers." }, category: "Deployment & Backend", tags: ["ai", "models", "api"], featured: false, displayOrder: 80, audience: ["ai-learners", "developers"], validationStatus: "valid" },
    { id: "supabase", name: "Supabase", canonicalUrl: "https://supabase.com/", description: { en: "Hosted Postgres platform with authentication, storage, and application services." }, category: "Deployment & Backend", tags: ["database", "backend", "postgres"], featured: true, displayOrder: 90, audience: ["developers"], validationStatus: "valid" },
    { id: "firebase", name: "Firebase", canonicalUrl: "https://firebase.google.com/", description: { en: "Google platform for application hosting, data, authentication, and related services." }, category: "Deployment & Backend", tags: ["backend", "hosting", "database", "google"], featured: false, displayOrder: 100, audience: ["developers"], validationStatus: "valid" },
    { id: "vercel", name: "Vercel", canonicalUrl: "https://vercel.com/", description: { en: "Cloud platform used to deploy the portfolio website." }, category: "Deployment & Backend", tags: ["deployment", "hosting", "nextjs"], featured: true, displayOrder: 110, audience: ["developers"], validationStatus: "valid" },
    { id: "jetbrains-academy", name: "JetBrains Academy", canonicalUrl: "https://www.jetbrains.com/academy/", description: { en: "Project-based programming learning resources from JetBrains." }, category: "Learning Platforms", tags: ["learning", "programming", "jetbrains"], featured: true, displayOrder: 120, audience: ["students", "developers"], validationStatus: "valid" },
    { id: "codewars", name: "Codewars", canonicalUrl: "https://www.codewars.com/", description: { en: "Programming practice through community-created coding challenges." }, category: "Practice & Challenges", tags: ["practice", "challenges", "programming"], featured: false, displayOrder: 130, audience: ["students", "developers"], validationStatus: "valid" },
    { id: "exercism", name: "Exercism", canonicalUrl: "https://exercism.org/", description: { en: "Free programming exercises and language learning tracks." }, category: "Practice & Challenges", tags: ["practice", "learning", "programming"], featured: true, displayOrder: 140, audience: ["students", "developers"], validationStatus: "valid" },
    { id: "leetcode", name: "LeetCode", canonicalUrl: "https://leetcode.com/problemset/", description: { en: "Programming and algorithm practice problem library." }, category: "Practice & Challenges", tags: ["algorithms", "practice", "interviews"], featured: true, displayOrder: 150, audience: ["students", "developers"], validationStatus: "valid" },
    { id: "mdn", name: "MDN Web Docs", canonicalUrl: "https://developer.mozilla.org/", description: { en: "Authoritative reference and learning material for open web technologies." }, category: "Documentation & Research", tags: ["web", "documentation", "javascript", "css"], featured: true, displayOrder: 170, audience: ["everyone", "developers", "students"], validationStatus: "valid" },
    { id: "github-docs", name: "GitHub Docs", canonicalUrl: "https://docs.github.com/", description: { en: "Official documentation for GitHub repositories and collaboration workflows." }, category: "Documentation & Research", tags: ["github", "documentation", "collaboration"], featured: false, displayOrder: 210, audience: ["developers", "students"], validationStatus: "valid" },
    { id: "docker-docs", name: "Docker Docs", canonicalUrl: "https://docs.docker.com/", description: { en: "Official documentation for Docker products and container workflows." }, category: "Documentation & Research", tags: ["docker", "containers", "documentation"], featured: false, displayOrder: 220, audience: ["developers"], validationStatus: "valid" },
    { id: "free-for-dev", name: "Free for Developers", canonicalUrl: "https://free-for.dev/", description: { en: "Curated list of software and infrastructure services with free tiers for developers." }, category: "Documentation & Research", tags: ["resources", "free-tier", "development"], featured: true, displayOrder: 230, audience: ["developers", "students"], validationStatus: "valid" },
    { id: "nextjs", name: "Next.js", canonicalUrl: "https://nextjs.org/", description: { en: "Official website and documentation entry point for Next.js." }, category: "Documentation & Research", tags: ["nextjs", "react", "documentation"], featured: false, displayOrder: 240, audience: ["developers"], validationStatus: "valid" },
    { id: "openeuler", name: "openEuler", canonicalUrl: "https://www.openeuler.org/en/", description: { en: "Open-source Linux operating-system community and documentation portal." }, category: "Learning Platforms", tags: ["linux", "open-source", "operating-system"], featured: false, displayOrder: 250, audience: ["developers", "students"], validationStatus: "valid" },
    { id: "cloudflare", name: "Cloudflare", canonicalUrl: "https://www.cloudflare.com/", description: { en: "Web infrastructure, DNS, security, and developer platform." }, category: "Domains & Web Infrastructure", tags: ["dns", "security", "deployment", "domains"], featured: true, displayOrder: 260, audience: ["developers"], validationStatus: "valid" },
  ],
  resume: {
    readyForPublicDownload: false,
    downloadPath: null,
  },
} satisfies PublicData;
