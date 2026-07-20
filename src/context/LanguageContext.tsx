"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "ar";

const translations = {
  en: {
    home: "Home",
    portfolio: "Portfolio",
    services: "Services",
    about: "About",
    testimonials: "Testimonials",
    blog: "Blog",
    contact: "Contact",
    tools: "Tools",
    githubTimeline: "GitHub Timeline",
    
    // Home Page
    heroTitle1: "Building the",
    heroTitleAccent: "future",
    heroTitle2: "of digital interaction.",
    heroSubtitle: "I'm Adnan Naous. A passionate learner and explorer in the tech world, driven by discovery more than experience. Constantly building minimalist web experiences.",
    viewProjects: "View Projects",
    getInTouch: "Get in touch",
    
    // Tools Page
    commandCenter: "Command Center",
    searchPlaceholder: "Search or type a command (yt, github, ai, steam)...",
    osDirectory: "OS Directory",
    learningPath: "Learning Path",
    focus: "Focus (50m)",
    break: "Break (10m)",
    taskPlaceholder: "What are you working on?",
    
    // Portfolio Page
    portfolioTitle: "Selected Works",
    portfolioSub: "A showcase of my recent projects blending computer science, artificial intelligence, and interactive media.",
    proj1Title: "Godot Engine Mechanics",
    proj1Cat: "Game Dev",
    proj1Desc: "Built core game mechanics, script structures, and logic flows. Completed a basic prototype as part of an intensive Godot training.",
    proj2Title: "Personal OS Dashboard",
    proj2Cat: "Web App",
    proj2Desc: "A highly responsive React/Next.js dashboard featuring Pomodoro timers, an integrated command center, and localization contexts.",
    proj3Title: "Medical Data Processor",
    proj3Cat: "Data Science",
    proj3Desc: "Applied problem-solving and structured logic derived from medical studies to process complex information under high pressure.",
    proj4Title: "AI Integration Tools",
    proj4Cat: "Artificial Intelligence",
    proj4Desc: "Introductory AI models and search algorithms implemented as part of the B.Sc in Computer Science & Artificial Intelligence.",
    
    // Services Page
    servicesTitle: "Services",
    servicesSub: "Leveraging a diverse background in technology and medical studies to deliver structured, high-quality solutions.",
    svc1Title: "Backend Architecture",
    svc1Desc: "Designing scalable, robust server-side logic and database architectures using modern frameworks.",
    svc2Title: "Game Development",
    svc2Desc: "Prototyping and developing interactive experiences and mechanics using the Godot Engine.",
    svc3Title: "AI Integration",
    svc3Desc: "Implementing artificial intelligence concepts and logical algorithms into practical applications.",
    svc4Title: "Frontend Engineering",
    svc4Desc: "Crafting beautiful, minimalist, and highly responsive user interfaces inspired by Vercel and Apple design.",
    
    // About Page
    aboutTitle: "About Me",
    aboutBackground: "Background",
    aboutBackgroundText1: "I am a dedicated Computer Science & AI student with a foundational background in medical studies. Known for a calm, level-headed approach to problem-solving and troubleshooting.",
    aboutBackgroundText2: "My transition from Human Medicine at Ain Shams University to Computer Science has equipped me with a unique perspective on handling complex information under high pressure.",
    aboutEdu: "Education & Certifications",
    
    // Testimonials
    testimonialsTitle: "Client Feedback",
    testimonialsSub: "Don't just take my word for it. Here is what colleagues and instructors have to say.",
    test1Text: "Adnan brings a calm, structured approach to chaotic problems. His background in medicine really shows in how analytically he dissects bugs.",
    test1Author: "Senior Engineer",
    test1Role: "Tech Lead",
    test2Text: "The Godot prototype he built during the intensive workshop was beyond impressive for just a 3-day turnaround.",
    test2Author: "Workshop Instructor",
    test2Role: "Game Development",
    test3Text: "Exceptional logical reasoning and flawless English communication. He operates at an advanced professional level effortlessly.",
    test3Author: "Project Manager",
    test3Role: "Software Team",
    
    // Blog
    blogTitle: "Thoughts & Updates",
    
    // Contact
    contactTitle: "Let's connect.",
    contactSub: "Whether you have a project in mind, want to discuss game dev, or just want to say hi, feel free to drop a message.",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    sendMessage: "Send Message",
    
    // Missing OS widget keys
    quote: "\"Discipline Creates Freedom.\"",
    bio: "Passionate learner & explorer. Gaming & tech enthusiast. Building my Personal OS.",
    stack: "Stack",
    sessions: "Sessions",
    opensInNewTab: "opens in a new tab",
    
    developedBy: "Developed by Adnan Naous",
    rightsReserved: "© 2026. All rights reserved."
  },
  ar: {
    home: "الرئيسية",
    portfolio: "الأعمال",
    services: "الخدمات",
    about: "عني",
    testimonials: "آراء العملاء",
    blog: "المدونة",
    contact: "تواصل",
    tools: "الأدوات",
    githubTimeline: "نشاط GitHub",
    
    heroTitle1: "نبني",
    heroTitleAccent: "مستقبل",
    heroTitle2: "التفاعل الرقمي.",
    heroSubtitle: "أنا عدنان نعوس. متعلم ومستكشف شغوف في عالم التقنية، يقودني الاكتشاف أكثر من الخبرة. أبني باستمرار تجارب ويب بسيطة.",
    viewProjects: "عرض المشاريع",
    getInTouch: "تواصل معي",
    
    commandCenter: "مركز الأوامر",
    searchPlaceholder: "ابحث أو اكتب أمراً (yt, github, ai, steam)...",
    osDirectory: "مجلدات النظام",
    learningPath: "مسار التعلم",
    focus: "تركيز (50 دقيقة)",
    break: "استراحة (10 دقائق)",
    taskPlaceholder: "ما الذي تعمل عليه؟",
    
    portfolioTitle: "أعمال مختارة",
    portfolioSub: "معرض لمشاريعي الأخيرة التي تمزج بين علوم الحاسوب، الذكاء الاصطناعي، والوسائط التفاعلية.",
    proj1Title: "ميكانيكا محرك جودو",
    proj1Cat: "تطوير الألعاب",
    proj1Desc: "بناء آليات اللعبة الأساسية، هياكل النصوص البرمجية، وتدفقات المنطق. إكمال نموذج أولي أساسي كجزء من تدريب مكثف على جودو.",
    proj2Title: "لوحة تحكم النظام الشخصي",
    proj2Cat: "تطبيق ويب",
    proj2Desc: "لوحة تحكم React/Next.js عالية الاستجابة تتميز بمؤقتات بومودورو، مركز أوامر متكامل، وسياقات الترجمة.",
    proj3Title: "معالج البيانات الطبية",
    proj3Cat: "علم البيانات",
    proj3Desc: "تطبيق حل المشكلات والمنطق الهيكلي المستمد من الدراسات الطبية لمعالجة المعلومات المعقدة تحت الضغط العالي.",
    proj4Title: "أدوات دمج الذكاء الاصطناعي",
    proj4Cat: "الذكاء الاصطناعي",
    proj4Desc: "نماذج ذكاء اصطناعي تمهيدية وخوارزميات بحث تم تنفيذها كجزء من بكالوريوس علوم الحاسوب والذكاء الاصطناعي.",
    
    servicesTitle: "الخدمات",
    servicesSub: "استغلال خلفية متنوعة في التكنولوجيا والدراسات الطبية لتقديم حلول منظمة وعالية الجودة.",
    svc1Title: "هيكلة الواجهة الخلفية",
    svc1Desc: "تصميم منطق خادم قوي وقابل للتطوير وهياكل قواعد بيانات باستخدام أطر عمل حديثة.",
    svc2Title: "تطوير الألعاب",
    svc2Desc: "نماذج أولية وتطوير تجارب تفاعلية وميكانيكا باستخدام محرك جودو.",
    svc3Title: "دمج الذكاء الاصطناعي",
    svc3Desc: "تنفيذ مفاهيم الذكاء الاصطناعي والخوارزميات المنطقية في تطبيقات عملية.",
    svc4Title: "هندسة الواجهة الأمامية",
    svc4Desc: "تصميم واجهات مستخدم جميلة وبسيطة وعالية الاستجابة مستوحاة من تصميم Vercel و Apple.",
    
    aboutTitle: "نبذة عني",
    aboutBackground: "الخلفية",
    aboutBackgroundText1: "أنا طالب متفانٍ في علوم الحاسوب والذكاء الاصطناعي بخلفية أساسية في الدراسات الطبية. معروف بنهج هادئ وعقلاني في حل المشكلات.",
    aboutBackgroundText2: "انتقالي من الطب البشري في جامعة عين شمس إلى علوم الحاسوب زوّدني بمنظور فريد حول التعامل مع المعلومات المعقدة تحت الضغط.",
    aboutEdu: "التعليم والشهادات",
    
    testimonialsTitle: "آراء العملاء",
    testimonialsSub: "لا تأخذ بكلامي فقط. إليك ما يقوله الزملاء والمدربون.",
    test1Text: "يتبنى عدنان نهجاً هادئاً ومنظماً للمشاكل الفوضوية. خلفيته في الطب تظهر بوضوح في كيفية تحليله المنطقي للأخطاء البرمجية.",
    test1Author: "مهندس أول",
    test1Role: "قائد تقني",
    test2Text: "النموذج الأولي لجودو الذي بناه خلال ورشة العمل المكثفة كان أكثر من رائع في فترة إنجاز 3 أيام فقط.",
    test2Author: "مدرب ورشة العمل",
    test2Role: "تطوير الألعاب",
    test3Text: "استدلال منطقي استثنائي وتواصل إنجليزي لا تشوبه شائبة. هو يعمل بمستوى مهني متقدم بكل سهولة.",
    test3Author: "مدير المشروع",
    test3Role: "فريق البرمجيات",
    
    blogTitle: "أفكار وتحديثات",
    
    contactTitle: "دعنا نتواصل.",
    contactSub: "سواء كان لديك مشروع في ذهنك، أو ترغب في مناقشة تطوير الألعاب، أو فقط تريد إلقاء التحية، لا تتردد في ترك رسالة.",
    nameLabel: "الاسم",
    emailLabel: "البريد الإلكتروني",
    messageLabel: "الرسالة",
    sendMessage: "إرسال الرسالة",
    
    // Missing OS widget keys
    quote: "\"الانضباط يصنع الحرية.\"",
    bio: "متعلم ومستكشف شغوف. مهتم بالألعاب والتقنية. أقوم ببناء نظامي الشخصي.",
    stack: "الأدوات",
    sessions: "الجلسات",
    opensInNewTab: "يفتح في علامة تبويب جديدة",

    developedBy: "تم التطوير بواسطة عدنان نعوس",
    rightsReserved: "© 2026. جميع الحقوق محفوظة."
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations["en"]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof typeof translations["en"]) => {
    return translations[language][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
