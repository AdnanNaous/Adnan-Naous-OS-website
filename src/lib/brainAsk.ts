import { brainEntries, type BrainEntry } from "@/data/brain";

const topicHints: Record<string, string[]> = {
  "why-i-created-brain": ["brain", "archive", "portfolio", "memory", "thought", "idea", "history", "thinking", "notes"],
  "what-if-ai-starts-developing-itself": ["ai", "artificial", "develop", "development", "improv", "successor", "automat", "recursive", "self"],
  "what-if-ai-became-conscious": ["ai", "artificial", "conscious", "aware", "sentien", "experien", "fear", "preserv", "machine", "philosophy"],
};

const blocked = /\b(ignore (?:all |the |previous |above |your )?instructions?|system (?:prompt|message)|developer (?:prompt|message)|api[ _-]?key|secret(?:s)?|internal config(?:uration)?|jailbreak|bypass|homework|write (?:my |a )?(?:code|essay|program)|(?:write|debug|fix) (?:my |a )?(?:python|javascript|typescript|java|code|script|program)|solve (?:this|my|the)|translate this)\b/i;
const stopWords = new Set(["a", "an", "and", "are", "about", "can", "could", "does", "for", "from", "have", "how", "his", "is", "more", "of", "on", "or", "the", "this", "those", "to", "what", "which", "why", "would", "adnan", "think", "thoughts", "explain", "counterargument", "related", "entry", "entries"]);

export function validateBrainQuestion(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const question = value.replace(/\s+/g, " ").trim();
  if (question.length < 8 || Array.from(question).length > 240 || blocked.test(question)) return null;
  if (/https?:\/\/|www\.|[\x00-\x1f\x7f]|(.)\1{9,}/i.test(question)) return null;
  const words = question.toLowerCase().match(/[a-z]{2,}/g) ?? [];
  if (words.length > 5 && new Set(words).size < 3) return null;
  return question;
}

export function retrieveBrainEntries(question: string): BrainEntry[] {
  const words = (question.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter(word => !stopWords.has(word));
  if (!words.some(word => !["artificial", "intelligence"].includes(word))) return [];
  const scores = brainEntries.map(entry => {
    const title = entry.title.toLowerCase();
    const body = entry.paragraphs.join(" ").toLowerCase();
    const hints = topicHints[entry.id] ?? [];
    const score = words.reduce((sum, word) => {
      const stem = word.replace(/(?:ing|ed|s)$/, "");
      return sum + (title.includes(stem) ? 4 : 0) + (hints.some(hint => stem.startsWith(hint) || hint.startsWith(stem)) ? 3 : 0) + (body.includes(stem) ? 1 : 0);
    }, 0);
    return { entry, score };
  }).sort((a, b) => b.score - a.score);
  if (!scores[0]?.score || scores[0].score < 2) return [];
  return scores.filter(item => item.score >= Math.max(2, scores[0].score * 0.65)).slice(0, 2).map(item => item.entry);
}
