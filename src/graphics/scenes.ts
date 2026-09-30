import type { Chapter } from "../motion/runtime";

export type SceneInput = {
  time: number; progress: number; velocity: number; pointerX: number; pointerY: number;
  mobile: boolean; reduced: boolean; quiet: boolean;
};
type C = CanvasRenderingContext2D;
const tau = Math.PI * 2;
const pulse = (time: number, speed = 1) => Math.sin(time * speed);
const line = (c: C, points: number[], color: string, width = 1) => {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath();
  c.moveTo(points[0], points[1]); for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]); c.stroke();
};
const polygon = (c: C, points: number[], fill: string, stroke?: string) => {
  c.beginPath(); c.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length; i += 2) c.lineTo(points[i], points[i + 1]);
  c.closePath(); c.fillStyle = fill; c.fill();
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); }
};
const ring = (c: C, x: number, y: number, radius: number, color: string, width = 1) => {
  c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.arc(x, y, radius, 0, tau); c.stroke();
};
const marker = (c: C, x: number, y: number, text: string, color = "#a9aaab72") => {
  c.fillStyle = color; c.font = "10px monospace"; c.letterSpacing = "2px"; c.fillText(text, x, y);
};
function atmosphere(c: C, x: number, y: number, radius: number, color: string) {
  const g = c.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, color); g.addColorStop(1, "#07080800");
  c.fillStyle = g; c.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
function floor(c: C, y: number, alpha = .18) {
  c.strokeStyle = `rgba(196,197,193,${alpha})`; c.lineWidth = 1;
  c.beginPath(); c.moveTo(0, y); c.lineTo(1200, y); c.stroke();
}

function home(c: C, s: SceneInput) {
  atmosphere(c, 900, 320, 660, "#6969663b");
  c.save(); c.translate(s.pointerX * .5 - s.progress * 64, s.pointerY * .5);
  c.font = "900 510px Arial, sans-serif"; c.lineWidth = 2; c.strokeStyle = "#c1c1bc24";
  c.strokeText("AN", 280, 535);
  c.fillStyle = "#1e1e1dd9"; c.fillText("AN", 284, 539);
  polygon(c, [760,-140,922,-140,665,940,510,940], "#131515", "#8b8a8133");
  polygon(c, [909,-140,1029,-140,866,940,742,940], "#232525", "#c8c7ba35");
  polygon(c, [1082,-140,1235,-140,1207,940,951,940], "#0b0d0e", "#66696622");
  const travel = (s.time * 22) % 800;
  line(c, [953,travel - 700,795,travel], "#deded164", 2);
  c.restore();
  marker(c, 864, 710, "01 / IDENTITY");
  marker(c, 60, 755, "SIGNAL ACQUIRED  ·  AN/OS", "#ddddcf4c");
}

function brain(c: C, s: SceneInput) {
  atmosphere(c, 658, 380, 590, "#6a727a31");
  const shift = s.progress * 150 + s.pointerX * .7;
  c.save(); c.translate(0, -shift * .12);
  for (let depth = 0; depth < 5; depth++) {
    const inset = depth * 43;
    c.strokeStyle = `rgba(199,206,207,${.13 + depth * .025})`;
    c.strokeRect(240 + inset, 100 + inset * .55, 760 - inset * 2, 590 - inset * 1.1);
  }
  const rows = s.mobile ? 5 : 7, cols = s.mobile ? 7 : 11;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const x = 300 + col * (620 / (cols - 1)) + (row % 2) * 11;
    const y = 150 + row * (445 / (rows - 1));
    const chosen = (row * 7 + col * 11) % 9 < 3;
    c.fillStyle = chosen ? "#d9dddd73" : "#c9d2d32a";
    c.fillRect(x, y, chosen ? 4 : 2, chosen ? 4 : 2);
    if (chosen && col < cols - 1) line(c, [x,y,x + 56,y + (((col * 3 + row) % 3) - 1) * 25], "#adb8bd30");
  }
  const scan = 130 + ((s.time * 35) % 530);
  c.fillStyle = "#b7c6cd11"; c.fillRect(240, scan, 760, 34);
  line(c, [240, scan, 1000, scan], "#d7e0e04a");
  c.restore();
  polygon(c, [116,-100,236,-100,376,900,267,900], "#111516a8", "#9ca9ab20");
  marker(c, 803, 80, "02 / PUBLIC MEMORY");
  marker(c, 784, 725, "ARCHIVE TOPOLOGY / ACTIVE");
}

function work(c: C, s: SceneInput) {
  atmosphere(c, 800, 430, 700, "#77766d2d");
  const advance = s.progress * 135;
  for (let i = 0; i < 7; i++) {
    const y = 95 + i * 88 - advance;
    const start = 545 + (i % 3) * 37;
    polygon(c, [start,y,1105,y - 22,start + 513,y + 48,start - 31,y + 72], i % 2 ? "#242626" : "#171918", "#a2a7a453");
    line(c, [start + 15,y + 27,start + 456,y + 8], "#d7d8cd38");
    for (let j = 0; j < 8; j++) c.fillRect(start + 45 + j * 40, y + 33, 17, 1);
  }
  const carriage = 152 + ((s.time * 62) % 720);
  polygon(c, [carriage,148,carriage + 35,148,carriage + 140,650,carriage + 100,650], "#070909bb", "#d7ded633");
  floor(c, 675, .35);
  marker(c, 764, 740, "03 / BUILT, TESTED, REVISED");
  marker(c, 88, 118, "BUILDING INDEX");
}

function now(c: C, s: SceneInput) {
  atmosphere(c, 650, 400, 650, "#70707028");
  const nodes: [number,number][] = [[204,180],[378,252],[618,176],[840,308],[1040,198],[284,512],[532,470],[768,566],[1018,630]];
  const edges = [[0,1],[1,2],[2,3],[3,4],[1,5],[5,6],[6,7],[7,8],[3,7],[2,6]];
  for (const [a,b] of edges) {
    const n = nodes[a], m = nodes[b];
    line(c, [n[0],n[1],n[0],m[1],m[0],m[1]], "#b6b6b647");
  }
  for (let i = 0; i < nodes.length; i++) {
    const [x,y] = nodes[i];
    const breathing = 3 + (pulse(s.time + i * .37, .9) + 1) * .8;
    ring(c,x,y,breathing + 12,"#d0d0d043");
    c.fillStyle = i === 6 ? "#ddddda" : "#c1c1beab"; c.fillRect(x - 2,y - 2,4,4);
    marker(c,x + 20,y - 10,`N${String(i + 1).padStart(2,"0")}`);
  }
  const train = (s.time * .08) % 1, a = nodes[5], b = nodes[6];
  c.fillStyle = "#e0e0de"; c.fillRect(a[0] + (b[0] - a[0]) * train, a[1] + (b[1] - a[1]) * train, 6, 3);
  marker(c, 772, 743, "04 / CURRENT PATH");
}

function codex(c: C, s: SceneInput) {
  atmosphere(c, 680, 460, 790, "#575e6c31");
  const horizon = 582;
  floor(c, horizon, .27);
  for (let i = 0; i < 15; i++) {
    const depth = i / 14;
    const y = horizon + Math.pow(depth, 1.65) * 238;
    line(c,[0,y,1200,y],`rgba(201,207,216,${.08 + depth * .18})`);
  }
  for (let i = -9; i <= 9; i++) line(c,[600,horizon,600 + i * 166,800],"#aeb6c12e");
  c.strokeStyle = "#d5d9de9c"; c.lineWidth = 2;
  c.beginPath(); c.moveTo(330,800); c.bezierCurveTo(430,650,560,550,664,420); c.bezierCurveTo(776,277,856,242,1110,-30); c.stroke();
  c.strokeStyle = "#8f9caa5e"; c.lineWidth = 1;
  c.beginPath(); c.moveTo(375,800); c.bezierCurveTo(458,662,594,548,700,412); c.bezierCurveTo(800,290,900,200,1160,-30); c.stroke();
  const t = (s.time * .09 + s.progress * .28) % 1;
  const x = 330 + 780 * t, y = 800 - 830 * (1 - Math.pow(1 - t, 1.8));
  ring(c,x,y,10,"#e8eaf0b5",2); c.fillStyle = "#e6e8ef"; c.fillRect(x - 2,y - 2,4,4);
  marker(c, 150, 745, "05 / LONG GAME");
  marker(c, 905, 126, "LEARN  /  MAKE  /  CONTRIBUTE");
}

function about(c: C, s: SceneInput) {
  atmosphere(c, 350, 350, 620, "#786c632b");
  atmosphere(c, 960, 490, 550, "#63717a29");
  const base = 420;
  c.strokeStyle = "#dedbd587"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0,base);
  for (let x = 0; x <= 1200; x += 4) {
    const heart = Math.sin((x - s.time * 35) * .018);
    const beat = Math.exp(-Math.pow(((x + 120) % 300 - 150) / 34, 2));
    const signal = x < 585 ? heart * 7 + beat * (Math.sin(x * .19) * 52) : Math.sin(x * .009 + s.time) * 8;
    c.lineTo(x, base + signal);
  }
  c.stroke();
  for (let i = 0; i < 9; i++) {
    const x = 620 + i * 68;
    const y = 290 + ((i * 53) % 245);
    line(c,[x,base,x,y,x + 40,y],"#adb7b74a");
    c.fillStyle = "#c6d0ca8a"; c.fillRect(x + 37,y - 3,6,6);
  }
  polygon(c,[547,0,614,0,661,800,589,800],"#131514a6","#aeb5ac2e");
  marker(c, 122, 690, "06 / ORIGIN");
  marker(c, 815, 690, "COMPUTING PATH");
}

function contact(c: C, s: SceneInput) {
  const x = 850 + s.pointerX * .25;
  atmosphere(c,x,405,650,"#969b9334");
  const width = 7 + (pulse(s.time,.62) + 1) * 2;
  const beam = c.createLinearGradient(x - 160,0,x + 200,0);
  beam.addColorStop(0,"#dde3d400"); beam.addColorStop(.48,"#dce2d41c"); beam.addColorStop(.52,"#ecf0e457"); beam.addColorStop(1,"#e8efe000");
  c.fillStyle = beam; c.fillRect(x - 160,60,360,700);
  c.fillStyle = "#e4e9d0ae"; c.fillRect(x,100,width,590);
  c.fillStyle = "#f1f5e426"; c.fillRect(x - 25,100,25,590);
  polygon(c,[x + width,100,1140,0,1200,0,1200,800,1100,800,x + width,690],"#0d1010ba");
  line(c,[x - 27,710,x + 60,710],"#dce1d565");
  marker(c, 250, 698, "07 / FINAL TRANSMISSION");
  marker(c, x + 29, 86, "CHANNEL OPEN");
}

export function paintChapter(c: C, chapter: Chapter, input: SceneInput, alpha: number) {
  if (alpha <= .001) return;
  c.save(); c.globalAlpha = alpha * (input.quiet ? .28 : 1);
  const base = c.createLinearGradient(0,0,1200,800);
  base.addColorStop(0,"#090a0b"); base.addColorStop(.55,"#111313"); base.addColorStop(1,"#070808");
  c.fillStyle = base; c.fillRect(0,0,1200,800);
  switch (chapter) {
    case "home": home(c,input); break;
    case "brain": brain(c,input); break;
    case "work": work(c,input); break;
    case "now": now(c,input); break;
    case "codex": codex(c,input); break;
    case "about": about(c,input); break;
    case "contact": contact(c,input); break;
  }
  c.restore();
}

export function paintOpening(c: C, chapter: Chapter, input: SceneInput, transition: number) {
  if (transition < .01 || input.quiet) return;
  const aperture = transition * 125;
  c.fillStyle = `rgba(2,3,4,${transition * .7})`;
  c.fillRect(0,0,1200,aperture);
  c.fillRect(0,800 - aperture,1200,aperture);
  line(c,[0,aperture,1200,aperture],`rgba(221,228,222,${transition * .36})`);
  marker(c, 70, 748, `${chapter.toUpperCase()} / SIGNAL LOCK`, `rgba(227,231,224,${transition * .6})`);
}

export function paintSignal(c: C, input: SceneInput, outgoing: number) {
  if (input.reduced || input.quiet) return;
  const intensity = Math.max(outgoing, Math.min(1, Math.abs(input.velocity) * .25)) * .25;
  if (intensity < .02) return;
  c.save(); c.globalAlpha = intensity;
  c.fillStyle = "#cb4448"; c.fillRect(0,389,1200,1);
  c.fillStyle = "#427b97"; c.fillRect(0,392,1200,1);
  c.fillStyle = "#d7dce2"; c.fillRect(0,394,1200,1);
  c.restore();
}

export function paintFinish(c: C, input: SceneInput) {
  const shade = c.createLinearGradient(0,0,0,800);
  shade.addColorStop(0,"#05060674"); shade.addColorStop(.22,"#05060600");
  shade.addColorStop(.8,"#05060600"); shade.addColorStop(1,"#0506069c");
  c.fillStyle = shade; c.fillRect(0,0,1200,800);
  if (!input.mobile) {
    c.strokeStyle = "#c8cac726"; c.strokeRect(38,36,1124,728);
    line(c,[60,48,166,48],"#d5d7d455");
    line(c,[1034,752,1140,752],"#d5d7d455");
  }
}
