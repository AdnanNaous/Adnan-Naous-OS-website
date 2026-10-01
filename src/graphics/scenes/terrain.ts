import type { Chapter } from "../../motion/runtime";
import type { SceneInput } from "../scenes";

// A sampled landscape, not a wallpaper: the same points travel through every chapter.
const points: { x: number; z: number; h: number; light: number; phase: number }[] = [];
const peak = (x: number, z: number, px: number, pz: number, spread: number, height: number) =>
  height * Math.exp(-((x - px) ** 2 + (z - pz) ** 2) / spread);
for (let row = 0; row < 108; row++) {
  const z = row / 107 * 2;
  for (let col = 0; col < 172; col++) {
    const x = col / 171 * 3.6 - 1.8;
    const ridge = peak(x, z, -.75, .7, .16, .88) + peak(x, z, -.14, .86, .12, 1.02)
      + peak(x, z, .54, 1.18, .2, .67) + peak(x, z, 1.21, 1.7, .22, .48);
    const folds = Math.sin(x * 22 + z * 8) * .035 + Math.sin(x * 47 - z * 18) * .018;
    const h = Math.max(.015, ridge + folds * (.2 + ridge));
    points.push({ x, z, h, light: Math.max(0, Math.min(1, .2 + ridge * .65 + Math.sin(x * 22 + z * 8) * .16)), phase: Math.sin(x * 3 + z * 4) });
  }
}
const tones = ["#56605f", "#79807f", "#a1a6a5", "#c5c8c7", "#e9ebea"];
let skyGrid: Path2D | undefined;

export function drawTerrain(c: CanvasRenderingContext2D, chapter: Chapter, input: SceneInput) {
  const still = input.reduced || input.quiet;
  const t = still ? 0 : input.time;
  const breath = Math.sin(t * .24), orbit = Math.sin(t * .105);
  const yaw = orbit * .065 + (still ? 0 : input.pointerX * .0016);
  const cos = Math.cos(yaw), sin = Math.sin(yaw);
  const paths = tones.map(() => new Path2D());
  const aspect = input.viewportAspect || 1.5;
  // Responsive camera framing changes composition, never the landscape's motion or detail.
  const width = aspect < .9 ? 910 : 1220;
  const contact = chapter === "contact";
  const horizon = contact ? 600 : 535;
  const cameraY = (still ? 0 : input.pointerY * .32) + breath * 12;
  c.save();
  c.strokeStyle = "#b6bfba10"; c.lineWidth = .65;
  c.beginPath(); c.moveTo(0, 298); c.lineTo(1200, 298); c.moveTo(905, 0); c.lineTo(905, 800); c.stroke();
  if (!skyGrid) {
    skyGrid = new Path2D();
    for (let y = 8; y < 800; y += 12) for (let x = 8; x < 1200; x += 12) skyGrid.rect(x, y, 1, 1);
  }
  c.fillStyle = "#b0bbb512"; c.fill(skyGrid);
  c.translate(905, 298); c.strokeStyle = "#c9ceca45";
  c.beginPath(); c.arc(0, 0, 42, 0, Math.PI * 2); c.stroke();
  c.setLineDash([2, 3]); c.rotate(t * .018); c.beginPath(); c.arc(0, 0, 66 + breath * 1.5, 0, Math.PI * 2); c.stroke();
  c.restore();
  for (const p of points) {
    const x = p.x * cos + (p.z - 1) * sin;
    const z = (p.z - 1) * cos - p.x * sin + 1;
    const perspective = 1 / (1 + z * .55);
    const ripple = still ? 0 : breath * p.phase * .022;
    const px = 540 + x * width * .38 * perspective + (still ? 0 : input.pointerX * .8);
    const py = horizon + z * 300 * perspective - (p.h + ripple) * 330 * perspective + cameraY;
    if (px < -4 || px > 1204 || py < 0 || py > 804) continue;
    const bin = Math.min(4, Math.floor(p.light * 5));
    const size = (.8 + perspective * .8) * (bin > 2 ? 1.1 : 1);
    paths[bin].rect(px, py, size, size);
  }
  c.save(); c.globalAlpha = contact ? .3 : .7;
  paths.forEach((path, i) => { c.fillStyle = tones[i]; c.fill(path); });
  c.restore();
  // Keep the reference's luminous ridges behind the interface, with a dark reading field.
  const shade = c.createLinearGradient(0, 0, 1200, 0);
  shade.addColorStop(0, "#05060699"); shade.addColorStop(.48, "#05060655"); shade.addColorStop(1, "#05060608");
  c.fillStyle = shade; c.fillRect(0, 0, 1200, 800);
}
