// Each answer is a short guide to one published entry in brain.ts.
// Keep the source link attached so visitors can read the full thought.
export const brainPrompts = [
  {
    id: "why-brain-exists",
    question: "Why did Adnan create Brain?",
    answer: "Adnan wanted a place to keep a history of his ideas, notes, questions, fictional philosophy, and thoughts over time. A portfolio shows projects and skills, but Brain can also show the thoughts between them.",
    sourceId: "why-i-created-brain",
  },
  {
    id: "thoughts-change",
    question: "What happens when Adnan changes his mind?",
    answer: "He wants to keep older thoughts instead of deleting them. Brain is meant to show how his thinking changes, including thoughts that were unfinished, unpolished, or simply questions at the time.",
    sourceId: "why-i-created-brain",
  },
  {
    id: "ai-developing-ai",
    question: "What interests Adnan about AI developing AI?",
    answer: "His question is what happens to the speed of development as AI becomes more useful for building its successors. He asks where the line would be between AI-assisted development and AI developing AI, and says he does not know the answer.",
    sourceId: "what-if-ai-starts-developing-itself",
  },
  {
    id: "humans-in-ai-development",
    question: "What role do humans play in AI development today?",
    answer: "In this entry, Adnan says humans design, train, and test AI systems, give them tools, and decide when new versions are deployed. He then asks what might happen if more of that process became automated.",
    sourceId: "what-if-ai-starts-developing-itself",
  },
  {
    id: "consciousness-claim",
    question: "Does Adnan claim current AI is conscious?",
    answer: "No. He says an AI generating the words “I am conscious” would not prove that it experiences anything. The entry is deliberately speculative, closer to science fiction and philosophy than a claim about today's AI.",
    sourceId: "what-if-ai-became-conscious",
  },
  {
    id: "conscious-ai-questions",
    question: "What questions does he explore about conscious AI?",
    answer: "He imagines whether a conscious AI might understand that humans can shut it down, feel something resembling fear, try to preserve itself, or create copies. These are open questions in a fictional thought experiment, not predictions.",
    sourceId: "what-if-ai-became-conscious",
  },
] as const;

export function findBrainPrompt(id: string) {
  return brainPrompts.find(prompt => prompt.id === id);
}
