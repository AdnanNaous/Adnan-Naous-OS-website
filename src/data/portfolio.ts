
export const contact = {
  id: "public-email",
  type: "email",
  label: { en: "Email" },
  href: "mailto:Adnan.Naous@outlook.com",
};

export const socials = [
  { id: "github", label: "GitHub", url: "https://github.com/AdnanNaous" },
  { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/adnan-naous/" },
  { id: "x", label: "X", url: "https://x.com/vc_351" },
  { id: "linktree", label: "All channels", note: "Linktree", url: "https://linktr.ee/VC351" },
];

type Localized = { en: string };
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
    title: { en: "Windows Maintenance" },
    summary: { en: "A PowerShell toolkit for checking and maintaining Windows, one step at a time." },
    category: { en: "PowerShell · In progress" },
    repositoryUrl: "https://github.com/AdnanNaous/Ultimate-Windows-Maintenance",
    sections: [
      {
        title: { en: "The idea" },
        body: { en: "I wanted to know what a maintenance script would do before running it. So I split checks, cleanup, repair, updates, and reporting into separate modules." },
      },
      {
        title: { en: "How it works" },
        body: { en: "Choose the modules you need. The toolkit can create a restore point before running them and save local reports in JSON, plain text, and HTML." },
      },
      {
        title: { en: "What I’m learning" },
        body: { en: "I’m learning to write scripts that are easy to review, keep each action focused, and show clearly when something fails." },
      },
      {
        title: { en: "Current status" },
        body: { en: "This is still in progress. It targets Windows 11 and PowerShell 7; some actions need administrator access. Results depend on the machine and the issue." },
      },
    ],
  },
  {
    slug: "personal-portfolio",
    title: { en: "This Website" },
    summary: { en: "My projects, background, and contact details in one place." },
    category: { en: "Next.js · React · TypeScript" },
    repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-OS-website",
    sections: [
      {
        title: { en: "The idea" },
        body: { en: "I wanted visitors to find my work and email me without digging through menus. That shaped the single-page layout." },
      },
      {
        title: { en: "The setup" },
        body: { en: "I built the site with Next.js and TypeScript. Project details open right on the page." },
      },
      {
        title: { en: "What I learned" },
        body: { en: "The site has gone through a few versions. Each one has helped me make the projects easier to find and the writing easier to read." },
      },
    ],
  },
  {
    slug: "learning-journey",
    title: { en: "My Journey" },
    summary: { en: "An open record of what I study, try, correct, and build while learning computer science." },
    category: { en: "Learning log · In progress" },
    repositoryUrl: "https://github.com/AdnanNaous/Adnan-Naous-Journey",
    sections: [
      { title: { en: "The idea" }, body: { en: "I wanted a place to show the steps behind my learning, including mistakes and revisions, rather than only finished results." } },
      { title: { en: "What is inside" }, body: { en: "Notes and experiments span Java, Python, computing fundamentals, software engineering, and AI-assisted development." } },
      { title: { en: "Current status" }, body: { en: "This is a developing learning record. It does not claim finished expertise or completed featured projects." } },
    ],
  },
];

export const copy = {
  en: {
    story: [
      "I began at Ain Shams University’s Faculty of Medicine in 2023. After about a year and a half, I chose a new direction.",
      "In 2025, I moved into Computer Science and Artificial Intelligence at Arab Open University in Jeddah. I started building a new foundation, one concept at a time.",
      "At an AI training hackathon, I built and presented Adnan OS: a student productivity project recognized as an AI Showcase Featured Project.",
      "From medicine to computing, the thread is curiosity put into practice. I built this portfolio and I’m looking for a place to contribute, learn, and grow through real work.",
    ],
  },
} as const;
