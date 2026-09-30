export type BrainPrompt = {
  id: string;
  question: string;
  answer: string;
  sourceId: string;
};

// Each chunk should stay small (about 100 prompts as the catalog grows).
// Only counts and import paths ship up front; question and answer text load
// for the selected chunks after the component mounts.
const chunks = [
  { count: 6, load: () => import("./brainPromptChunk0").then(module => module.brainPrompts) },
] satisfies readonly { count: number; load: () => Promise<readonly BrainPrompt[]> }[];

export const brainPromptCount = chunks.reduce((total, chunk) => total + chunk.count, 0);

export async function loadBrainPrompts(indexes: readonly number[]): Promise<BrainPrompt[]> {
  return Promise.all(indexes.map(async index => {
    if (!Number.isInteger(index) || index < 0 || index >= brainPromptCount) throw new Error("Invalid Brain prompt index");
    let localIndex = index;
    for (const chunk of chunks) {
      if (localIndex < chunk.count) {
        const prompts = await chunk.load();
        if (prompts.length !== chunk.count || !prompts[localIndex]) throw new Error("Brain prompt catalog mismatch");
        return prompts[localIndex];
      }
      localIndex -= chunk.count;
    }
    throw new Error("Missing Brain prompt");
  }));
}
