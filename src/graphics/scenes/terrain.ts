import type { Chapter } from "../../motion/runtime";
import type { SceneInput } from "../scenes";

// A sampled landscape, not a wallpaper: the same points travel through every chapter.
const points: { x: number; z: number; h: number; light: number; phase: number; layer: number; nx: number; ny: number; nz: number }[] = [];
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
    points.push({ x, z, h, light: Math.max(0, Math.min(1, .2 + ridge * .65 + Math.sin(x * 22 + z * 8) * .16)), phase: Math.sin(x * 3 + z * 4), layer: Math.min(9, Math.floor(row / 108 * 10)), nx: 0, ny: 1, nz: 0 });
  }
}
// Cache surface normals once; pointer light follows the actual slopes of the relief.
points.forEach((p, i) => {
  const col = i % 172;
  const nx = -((points[col < 171 ? i + 1 : i].h - points[col > 0 ? i - 1 : i].h) / .042);
  const nz = -((points[Math.min(points.length - 1, i + 172)].h - points[Math.max(0, i - 172)].h) / .037);
  const length = Math.hypot(nx, 1, nz);
  p.nx = nx / length; p.ny = 1 / length; p.nz = nz / length;
});
const tones = ["#56605f", "#79807f", "#a1a6a5", "#c5c8c7", "#e9ebea"];
let skyGrid: Path2D | undefined;

export function drawTerrain(c: CanvasRenderingContext2D, chapter: Chapter, input: SceneInput) {
  const still = input.reduced || input.quiet;
  const t = input.reduced ? 0 : input.time;
  const breath = Math.sin(t * .24), orbit = Math.sin(t * .105);
  const yaw = orbit * .065 + input.pointerX * .003;
  const cos = Math.cos(yaw), sin = Math.sin(yaw);
  const layers = Array.from({ length: 10 }, () => tones.map(() => new Path2D()));
  const spectral = [new Path2D(), new Path2D()];
  const energy = still ? 0 : Math.min(1, input.pointerForce || 0);
  const lx = input.pointerX / 18, ly = 1.2, lz = input.pointerY / 12 + .5;
  const lightLength = Math.hypot(lx, ly, lz);
  const lightX = 600 + lx * 600, lightY = 400 + input.pointerY / 12 * 400;
  const aspect = input.viewportAspect || 1.5;
  // Responsive camera framing changes composition, never the landscape's motion or detail.
  const width = aspect < .9 ? 910 : 1220;
  const exposure = input.exposure ?? (chapter === "contact" ? .3 : .7);
  const horizon = 535;
  const cameraY = input.pointerY * .32 + breath * 12;
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
    const ripple = input.reduced ? 0 : breath * p.phase * .022;
    const depth = 1 - p.layer / 10;
    const px = 540 + x * width * .38 * perspective + input.pointerX * (.4 + depth * 1.6);
    const py = horizon + z * 300 * perspective - (p.h + ripple) * 330 * perspective + cameraY;
    if (px < -4 || px > 1204 || py < 0 || py > 804) continue;
    const spotlight = Math.max(0, 1 - ((px - lightX) ** 2 / 90000 + (py - lightY) ** 2 / 64000));
    const incidence = Math.max(0, (p.nx * lx + p.ny * ly + p.nz * lz) / lightLength);
    const specular = incidence ** 8 * spotlight;
    const bin = Math.min(4, Math.floor((p.light + energy * (spotlight * incidence * .25 + specular * .3)) * 5));
    const size = (.8 + perspective * .8) * (bin > 2 ? 1.1 : 1);
    layers[p.layer][bin].rect(px, py, size, size);
    if (energy > .035 && spotlight > .05 && bin > 1) {
      spectral[0].rect(px - (2 + depth * 3) * energy, py - energy, size, size);
      spectral[1].rect(px + (2 + depth * 3) * energy, py + energy, size, size);
    }
  }
  c.save();
  for (let layer = 9; layer >= 0; layer--) {
    const depth = 1 - layer / 10;
    c.save(); c.translate(-input.pointerX * depth * .7, 5 + depth * 8);
    c.globalAlpha = .2 * exposure; c.fillStyle = "#000";
    layers[layer].forEach(path => c.fill(path)); c.restore();
    c.globalAlpha = exposure;
    layers[layer].forEach((path, i) => { c.fillStyle = tones[i]; c.fill(path); });
  }
  c.globalAlpha = energy * exposure * .55; c.globalCompositeOperation = "screen";
  c.fillStyle = "#58dfff"; c.fill(spectral[0]); c.fillStyle = "#e36eb8"; c.fill(spectral[1]);
  c.restore();
  // Keep the reference's luminous ridges behind the interface, with a dark reading field.
  const shade = c.createLinearGradient(0, 0, 1200, 0);
  shade.addColorStop(0, "#05060699"); shade.addColorStop(.48, "#05060655"); shade.addColorStop(1, "#05060608");
  c.fillStyle = shade; c.fillRect(0, 0, 1200, 800);
}
