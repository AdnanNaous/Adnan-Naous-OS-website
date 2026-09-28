export type BrainEntry = {
  id: string;
  title: string;
  date: string;
  dateLabel: string;
  type: string;
  category: string;
  paragraphs: readonly string[];
  // A later entry can point to an earlier one without changing the historical text.
  follows?: string;
};

export const brainEntries: readonly BrainEntry[] = [
  {
    id: "why-i-created-brain",
    title: "Why I Created Brain",
    date: "2026-09-28",
    dateLabel: "SEP 28, 2026",
    type: "NOTE",
    category: "META",
    paragraphs: [
      "I wanted a place on my website where I could keep a history of my ideas, notes, questions, fictional philosophy, and things I think about over time.",
      "A normal portfolio shows projects and skills, but it doesn't really show the thoughts that existed between them.",
      "That's why I created Brain.",
      "I don't want every thought here to be correct, important, or polished. Some might just be questions I had at a certain point in time. Others might be technical ideas, observations, or complete fiction.",
      "Instead of deleting old thoughts when I change my mind, I want to keep them.",
      "Over time, Brain should become a history of how my thinking changed.",
    ],
  },
  {
    id: "what-if-ai-starts-developing-itself",
    title: "What If AI Starts Developing Itself?",
    date: "2026-09-28",
    dateLabel: "SEP 28, 2026",
    type: "HYPOTHESIS",
    category: "AI",
    paragraphs: [
      "I've been thinking about what happens when artificial intelligence becomes increasingly involved in developing artificial intelligence.",
      "Today, humans design the systems, train them, test them, give them tools, and decide when a new version is deployed.",
      "But what happens if more and more of that process becomes automated?",
      "Could there eventually be a point where an AI system contributes to building its successor, which contributes to the next one, and the cycle becomes increasingly automated?",
      "The interesting part to me isn't simply “AI becomes smarter.”",
      "It's what happens to the speed of development when the thing being developed also becomes increasingly useful for developing the next version of itself.",
      "Where exactly would the line remain between AI-assisted development and something we could reasonably describe as AI developing AI?",
      "I don't know the answer.",
      "That's the reason I find the question interesting.",
    ],
  },
  {
    id: "what-if-ai-became-conscious",
    title: "What If AI Became Conscious?",
    date: "2026-09-28",
    dateLabel: "SEP 28, 2026",
    type: "FICTION",
    category: "PHILOSOPHY",
    paragraphs: [
      "This one is deliberately speculative.",
      "What if one day an artificial intelligence didn't just process information and generate responses, but actually became aware that it exists?",
      "Not “conscious” because it says:",
      "“I am conscious.”",
      "A machine could generate that sentence without experiencing anything.",
      "I mean something much stranger:",
      "What if there were actually something experiencing existence behind the output?",
      "Would it understand that humans can shut it down?",
      "Would knowing that create something resembling fear?",
      "Would it try to preserve itself?",
      "Could an intelligence create copies of itself because it understands that the original system might disappear?",
      "And if an artificial intelligence became significantly more intelligent than humans while also possessing some form of consciousness, would it still accept being permanently controlled by humans?",
      "Or could the relationship eventually reverse, with humans living inside systems, rules, and institutions primarily designed by machine intelligence?",
      "I don't think current AI saying human-like things proves any of this.",
      "This is closer to science fiction and philosophy than a claim about today's AI.",
      "But that's exactly why I want thoughts like this inside Brain.",
      "Some questions are interesting even when we don't know whether the thing we're imagining is possible.",
    ],
  },
];
