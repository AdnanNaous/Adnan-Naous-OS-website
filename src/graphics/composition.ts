/** Authored flat plates. No geometry, perspective camera, model or external asset. */
export interface Plate { image: HTMLCanvasElement; depth: number; opacity: number }
export interface Composition { plates: Plate[]; grain: HTMLCanvasElement; dispose: () => void }

export function createComposition(width: number, height: number, mobile: boolean): Composition {
  const plates: Plate[] = [];
  // Cache at CSS resolution: the artwork is intentionally soft and matte.
  const plate = (depth: number, opacity: number, paint: (c: CanvasRenderingContext2D) => void) => {
    const image = document.createElement("canvas");
    image.width = Math.ceil(width); image.height = Math.ceil(height);
    const c = image.getContext("2d");
    if (!c) throw new Error("Canvas2D unavailable");
    c.scale(width / 1200, height / 800); paint(c);
    plates.push({ image, depth, opacity });
  };
  plate(.08, 1, (c) => {
    const atmosphere = c.createRadialGradient(865, 335, 0, 820, 400, 620);
    atmosphere.addColorStop(0, "#59534a"); atmosphere.addColorStop(.34, "#292723"); atmosphere.addColorStop(1, "#090909");
    c.fillStyle = atmosphere; c.fillRect(0, 0, 1200, 800);
    c.fillStyle = "#0d0d0ded";
    c.beginPath(); c.moveTo(0, 0); c.lineTo(705, 0); c.lineTo(640, 210); c.lineTo(680, 475); c.lineTo(480, 800); c.lineTo(0, 800); c.fill();
  });
  plate(.24, .72, (c) => {
    c.strokeStyle = "#b5a99428"; c.lineWidth = .7;
    // Broken contour lines suggest strata in a technical cross-section.
    for (let i = 0; i < (mobile ? 10 : 19); i++) {
      const x = 742 + i * 18;
      c.beginPath(); c.moveTo(x + 100, -40); c.bezierCurveTo(x - 45, 210, x + 120, 315, x - 14, 548); c.bezierCurveTo(x - 70, 650, x - 125, 700, x - 108, 840); c.stroke();
    }
    c.fillStyle = "#0b0c0c";
    c.beginPath(); c.moveTo(1150, 0); c.lineTo(1200, 0); c.lineTo(1200, 800); c.lineTo(970, 800); c.bezierCurveTo(1090, 560, 1030, 330, 1150, 0); c.fill();
  });
  plate(.52, 1, (c) => {
    const edge = c.createLinearGradient(670, 0, 1000, 0);
    edge.addColorStop(0, "#111212"); edge.addColorStop(.7, "#171818"); edge.addColorStop(1, "#34332f");
    c.fillStyle = edge;
    c.beginPath(); c.moveTo(825, -40); c.bezierCurveTo(715, 142, 757, 287, 740, 440); c.bezierCurveTo(727, 605, 668, 715, 610, 840); c.lineTo(860, 840); c.bezierCurveTo(940, 598, 872, 450, 895, 290); c.bezierCurveTo(920, 145, 957, 80, 970, -40); c.closePath(); c.fill();
    c.strokeStyle = "#bdb4a150"; c.lineWidth = .9;
    c.beginPath(); c.moveTo(970, -40); c.bezierCurveTo(957, 80, 920, 145, 895, 290); c.bezierCurveTo(872, 450, 940, 598, 860, 840); c.stroke();
    c.strokeStyle = "#8f887822";
    for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(756, 180 + i * 59); c.lineTo(884, 168 + i * 59); c.stroke(); }
  });
  if (!mobile) plate(.68, .6, (c) => {
    const mist = c.createRadialGradient(950, 560, 5, 950, 560, 350);
    mist.addColorStop(0, "#9d907322"); mist.addColorStop(1, "#9d907300");
    c.fillStyle = mist; c.fillRect(400, 160, 800, 640);
    c.fillStyle = "#d5ccaf30";
    for (let i = 0; i < 25; i++) c.fillRect(600 + ((i * 139) % 540), 80 + ((i * 197) % 670), .9, .9);
  });
  plate(.95, .9, (c) => {
    const shadow = c.createLinearGradient(1050, 0, 1190, 0);
    shadow.addColorStop(0, "#07080800"); shadow.addColorStop(.5, "#070808ce"); shadow.addColorStop(1, "#070808");
    c.fillStyle = shadow; c.beginPath(); c.moveTo(1100, -100); c.lineTo(1350, -100); c.lineTo(1350, 900); c.lineTo(940, 900); c.bezierCurveTo(1100, 550, 1090, 200, 1100, -100); c.fill();
  });
  const grain = document.createElement("canvas"); grain.width = grain.height = 128;
  const ink = grain.getContext("2d");
  if (ink) {
    const pixels = ink.createImageData(128, 128); let seed = 47;
    for (let i = 0; i < pixels.data.length; i += 4) { seed = (seed * 1664525 + 1013904223) >>> 0; pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = seed % 255; pixels.data[i + 3] = 13; }
    ink.putImageData(pixels, 0, 0);
  }
  return { plates, grain, dispose: () => { for (const p of plates) p.image.width = p.image.height = 0; grain.width = grain.height = 0; } };
}
