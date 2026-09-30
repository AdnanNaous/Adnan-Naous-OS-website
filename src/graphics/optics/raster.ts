export type GlyphCapture = {
  source: HTMLCanvasElement; left: number; top: number; width: number; height: number; scale: number;
};
type TextRun = { text: string; rect: DOMRect; style: CSSStyleDeclaration };
const PADDING = 44;

/** Range fragments reproduce the actual DOM wrapping and nested type styles.
 * Layout is read only when invalidated, never inside the render loop.
 * Whole line runs preserve kerning/ligatures; Canvas letterSpacing matches tracking.
 */
export function captureGlyphs(element: HTMLElement, scale: number, maxTextureSize: number): GlyphCapture | null {
  const runs: TextRun[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node: Node | null;
  let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
  while ((node = walker.nextNode())) {
    const text = node.textContent || "";
    const parent = node.parentElement;
    if (!parent || !text.trim()) continue;
    const style = getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden") continue;
    let start = 0, lastTop = NaN;
    const flush = (end: number) => {
      if (end <= start) return;
      range.setStart(node!, start); range.setEnd(node!, end);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      let content = text.slice(start, end);
      if (style.textTransform === "uppercase") content = content.toUpperCase();
      else if (style.textTransform === "lowercase") content = content.toLowerCase();
      runs.push({ text: content, rect, style });
      left = Math.min(left, rect.left); top = Math.min(top, rect.top);
      right = Math.max(right, rect.right); bottom = Math.max(bottom, rect.bottom);
    };
    for (let index = 0; index < text.length; index++) {
      range.setStart(node, index); range.setEnd(node, index + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      if (Number.isFinite(lastTop) && Math.abs(rect.top - lastTop) > 2) { flush(index); start = index; }
      lastTop = rect.top;
    }
    flush(text.length);
  }
  range.detach();
  if (!runs.length || !Number.isFinite(left)) return null;
  left -= PADDING; top -= PADDING;
  const width = Math.ceil(right - left + PADDING), height = Math.ceil(bottom - top + PADDING);
  const density = Math.min(scale, maxTextureSize / width, maxTextureSize / height, Math.sqrt(900000 / (width * height)));
  if (density < .5) return null;
  const source = document.createElement("canvas");
  source.width = Math.ceil(width * density); source.height = Math.ceil(height * density);
  const ctx = source.getContext("2d");
  if (!ctx) return null;
  ctx.scale(density, density);
  ctx.textBaseline = "alphabetic";
  for (const { text, rect, style } of runs) {
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    ctx.fontKerning = style.fontKerning as CanvasFontKerning;
    ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    ctx.fontStretch = style.fontStretch as CanvasFontStretch;
    ctx.fillStyle = style.color;
    const metrics = ctx.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent || parseFloat(style.fontSize) * .8;
    const descent = metrics.fontBoundingBoxDescent || parseFloat(style.fontSize) * .2;
    const baseline = rect.top - top + (rect.height - ascent - descent) / 2 + ascent;
    ctx.fillText(text, rect.left - left, baseline);
  }
  return { source, left, top: top + window.scrollY, width, height, scale: density };
}
