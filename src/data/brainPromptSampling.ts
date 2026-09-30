// Pick unique catalog indexes. If there are enough alternatives, the next
// group excludes every index currently on screen.
export function samplePromptIndexes(total: number, count: number, current: readonly number[] = [], random: () => number = Math.random): number[] {
  if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(count) || count < 0) throw new Error("Invalid prompt catalog size");
  const wanted = Math.min(total, count);
  const excluded = new Set(current.filter(index => Number.isInteger(index) && index >= 0 && index < total));
  const canExcludeCurrent = total - excluded.size >= wanted;
  const candidates: number[] = [];
  for (let index = 0; index < total; index++) {
    if (!canExcludeCurrent || !excluded.has(index)) candidates.push(index);
  }
  const selected: number[] = [];
  for (let index = 0; index < wanted; index++) {
    const position = index + Math.min(Math.floor(random() * (candidates.length - index)), candidates.length - index - 1);
    [candidates[index], candidates[position]] = [candidates[position], candidates[index]];
    selected.push(candidates[index]);
  }
  return selected;
}
