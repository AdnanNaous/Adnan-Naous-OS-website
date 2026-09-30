import type { Chapter } from "../../motion/runtime";
import type { SceneInput } from "../scenes";
type C = CanvasRenderingContext2D;
type V = readonly [
    number,
    number,
    number
];
type Face = {
    indices: number[];
    tone: number;
    hatch: number;
};
type Mesh = {
    vertices: V[];
    faces: Face[];
    projected: Float32Array;
    depth: number;
    motion: number;
    phase: number;
    mobile: boolean;
    label?: string;
    signal?: boolean;
};
type Set = {
    meshes: Mesh[];
    tint: readonly [
        number,
        number,
        number
    ];
    name: string;
};
const sets = new Map<Chapter, Set>();
const TAU = Math.PI * 2;
const surfaceGrain = new Float32Array(96);
// A repeatable surface texture, generated once rather than randomized per frame.
let grainSeed = 731;
for (let i = 0; i < surfaceGrain.length; i++) {
    grainSeed = (grainSeed * 1664525 + 1013904223) >>> 0;
    surfaceGrain[i] = (grainSeed % 1009) / 1009;
}
/** Geometry is built once on first use. Rendering reuses the projection buffers. */
function mesh(vertices: V[], faces: Face[], motion = 0, phase = 0, mobile = true, label?: string): Mesh {
    return { vertices, faces, projected: new Float32Array(vertices.length * 3),
        depth: vertices.reduce((sum, p) => sum + p[2], 0) / vertices.length,
        motion, phase, mobile, label };
}
function slab(out: Mesh[], shape: readonly (readonly [
    number,
    number
])[], z: number, thickness: number, tone: number, motion = 0, phase = 0, mobile = true, label?: string) {
    const n = shape.length, vertices: V[] = [];
    for (const p of shape)
        vertices.push([p[0], p[1], z + thickness]);
    for (const p of shape)
        vertices.push([p[0], p[1], z]);
    const faces: Face[] = [];
    for (let i = 0; i < n; i++)
        faces.push({ indices: [i, (i + 1) % n, (i + 1) % n + n, i + n], tone: tone * (i % 2 ? .57 : .8), hatch: 0 });
    faces.push({ indices: Array.from({ length: n }, (_, i) => i + n), tone, hatch: 1 });
    out.push(mesh(vertices, faces, motion, phase, mobile, label));
}
function plate(out: Mesh[], x: number, y: number, w: number, h: number, z: number, thickness: number, tone: number, motion = 0, phase = 0, mobile = true, label?: string) {
    slab(out, [[x, y], [x + w, y - 12], [x + w, y + h - 12], [x, y + h]], z, thickness, tone, motion, phase, mobile, label);
}
function rib(out: Mesh[], x: number, y: number, z: number, radius: number, thickness: number, tone: number, mobile = true) {
    const shape: [
        number,
        number
    ][] = [];
    for (let i = 0; i < 32; i++) {
        const a = i / 31 * Math.PI * 1.58 + .23;
        shape.push([x + Math.cos(a) * radius, y + Math.sin(a) * radius]);
    }
    for (let i = 31; i >= 0; i--) {
        const a = i / 31 * Math.PI * 1.58 + .23;
        shape.push([x + Math.cos(a) * (radius - 19), y + Math.sin(a) * (radius - 19)]);
    }
    slab(out, shape, z, thickness, tone, 0, 0, mobile);
}
function route(out: Mesh[], a: V, b: V, width: number, tone: number, label?: string, signal = false) {
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length * width, ny = dx / length * width;
    const vertices: V[] = [[a[0] - nx, a[1] - ny, a[2]], [b[0] - nx, b[1] - ny, b[2]],
        [b[0] + nx, b[1] + ny, b[2]], [a[0] + nx, a[1] + ny, a[2]],
        [a[0] - nx, a[1] - ny + 12, a[2] + 30], [b[0] - nx, b[1] - ny + 12, b[2] + 30]];
    out.push(mesh(vertices, [{ indices: [0, 1, 5, 4], tone: tone * .55, hatch: 0 },
        { indices: [0, 1, 2, 3], tone, hatch: 1 }], 0, 0, true, label));
    out[out.length - 1].signal = signal;
}
function build(chapter: Chapter): Set {
    const m: Mesh[] = [];
    const set: Set = { meshes: m, tint: [180, 185, 179], name: "IDENTITY / 01" };
    switch (chapter) {
        case "home": {
            for (let i = 6; i >= 0; i--) {
                const x = -180 + i * 112;
                slab(m, [[x, -760], [x + 74, -760], [x - 144, 690], [x - 246, 690]], 420 + i * 180, 72 + i * 7, 47 + i * 4, .8, i, i < 3 || i === 6, i === 2 ? "AN / 001" : undefined);
            }
            slab(m, [[-90, 220], [65, -355], [153, -355], [5, 220]], 940, 140, 61);
            slab(m, [[153, -355], [263, 220], [183, 220], [109, -170]], 940, 140, 47);
            slab(m, [[37, 10], [199, 10], [208, 64], [21, 64]], 912, 36, 81);
            plate(m, 345, -430, 40, 960, 260, 150, 22);
            break;
        }
        case "brain": {
            set.tint = [159, 184, 193];
            set.name = "PUBLIC MEMORY / 02";
            for (let depth = 5; depth >= 0; depth--) {
                const z = 470 + depth * 225;
                rib(m, 68, -15, z, 410 + depth * 44, 50, 39 + depth * 3, depth < 2);
                for (let j = 0; j < 5; j++) {
                    const x = -275 + j * 148 + (depth % 2) * 28;
                    const y = -325 + ((j * 107 + depth * 51) % 475);
                    plate(m, x, y, 112, 182 + (j % 2) * 58, z, 16, 45 + (j % 3) * 12, .24, depth + j, depth < 2 && j > 1, j === 3 ? `MEM / ${String(depth * 17 + j).padStart(3, "0")}` : undefined);
                }
            }
            slab(m, [[330, -470], [495, -470], [495, 540], [390, 540], [390, 145], [330, 145]], 310, 100, 37, 0, 0, true, "INDEX / A");
            for (let i = 0; i < 8; i++)
                plate(m, 352, -390 + i * 57, 70, 12, 285, 24, 68, 0, 0, i % 2 === 0);
            break;
        }
        case "work": {
            set.tint = [190, 185, 168];
            set.name = "BUILT / TESTED / REVISED / 03";
            for (let i = 6; i >= 0; i--) {
                const y = -430 + i * 137, x = -235 + (i % 3) * 65, z = 420 + i * 88;
                slab(m, [[x, y], [x + 550, y - 50], [x + 540, y + 39], [x + 185, y + 96], [x - 50, y + 69]], z, 75, 62 + i * 3, 1.3, i * .8, i % 2 === 0, `PLATE / ${String(i + 1).padStart(2, "0")}`);
                for (let j = 0; j < 3; j++)
                    plate(m, x + 80 + j * 125, y + 13, 64, 10, z - 13, 20, 103, 1.3, i * .8, i % 2 === 0);
            }
            slab(m, [[390, -750], [465, -750], [375, 720], [295, 720]], 260, 190, 34);
            slab(m, [[-140, 600], [580, 520], [670, 650], [-220, 790]], 440, 120, 28, 0, 0, true, "ASSEMBLY DATUM");
            break;
        }
        case "now": {
            set.tint = [173, 193, 185];
            set.name = "CURRENT PATH / 04";
            const nodes: V[] = [[-330, -300, 1350], [-70, -90, 1030], [250, -340, 1230], [445, -75, 760],
                [200, 230, 500], [-150, 375, 910], [430, 490, 350]];
            const edges = [[0, 1], [1, 2], [2, 3], [1, 5], [5, 4], [3, 4], [4, 6]];
            for (const e of edges)
                route(m, nodes[e[0]], nodes[e[1]], 13, 64, undefined, e[0] === 5);
            for (let i = 0; i < nodes.length; i++) {
                const n = nodes[i];
                rib(m, n[0], n[1], n[2] - 24, 51, 46, 102, i > 2);
                plate(m, n[0] - 22, n[1] - 12, 44, 24, n[2] - 45, 28, 138, .9, i, true, `N${String(i + 1).padStart(2, "0")}`);
                plate(m, n[0] - 9, n[1] + 42, 18, 270, n[2] + 25, 40, 29, 0, 0, i > 2);
            }
            route(m, [425, 500, 320], [680, -650, 380], 24, 47, "LIVE / 06");
            break;
        }
        case "codex": {
            set.tint = [170, 182, 207];
            set.name = "LEARN / MAKE / CONTRIBUTE / 05";
            for (let i = 11; i >= 0; i--) {
                const z = 320 + i * 130, x = -160 + i * 54, y = 440 - i * 91;
                slab(m, [[x - 78, y], [x + 114, y - 40], [x + 155, y + 6], [x - 34, y + 43]], z, 47, 52 + i * 2, .35, i, i % 2 === 0, i % 3 === 0 ? `STEP / ${i.toString(16).toUpperCase().padStart(2, "0")}` : undefined);
                if (i < 11) {
                    route(m, [x + 26, y - 20, z], [x + 80, y - 110, z + 130], 5, 117, undefined, i === 3);
                    route(m, [x + 80, y - 15, z], [x + 265, y - 115, z + 280], 3, 62);
                    plate(m, x + 240, y - 130, 98, 34, z + 280, 24, 49, 0, 0, false, "RETURN");
                }
            }
            for (let i = 0; i < 6; i++)
                route(m, [-380 + i * 145, 650, 300], [-70 + i * 100, -350, 1800], 3, 36);
            break;
        }
        case "about": {
            set.tint = [199, 177, 157];
            set.name = "ORIGIN / COMPUTING PATH / 06";
            for (let layer = 4; layer >= 0; layer--) {
                const shape: [
                    number,
                    number
                ][] = [];
                for (let i = 0; i <= 72; i++) {
                    const x = -540 + i * 18, envelope = Math.exp(-Math.pow((i - 26) / 13, 2));
                    const wave = Math.sin(i * .81) * envelope * 96 + Math.sin(i * .17) * 18;
                    shape.push([x + layer * 46, wave + layer * 122 - 220]);
                }
                for (let i = 72; i >= 0; i--) {
                    const x = -540 + i * 18, envelope = Math.exp(-Math.pow((i - 26) / 13, 2));
                    const wave = Math.sin(i * .81) * envelope * 96 + Math.sin(i * .17) * 18;
                    shape.push([x + layer * 46, wave + layer * 122 - 143]);
                }
                slab(m, shape, 430 + layer * 195, 35, 64 + layer * 10, .24, layer, layer < 3, layer === 1 ? "ORIGIN / CONTINUOUS" : undefined);
            }
            for (let i = 0; i < 5; i++) {
                const x = 120 + i * 93, y = -255 + (i % 3) * 90;
                plate(m, x, y, 62, 198, 830 + i * 100, 18, 44, 0, 0, i < 3, `CH / ${i + 1}`);
                route(m, [x + 30, y + 198, 830 + i * 100], [x + 30, 180, 650], 2, 73);
            }
            slab(m, [[412, -640], [458, -640], [525, 690], [456, 690]], 300, 100, 28);
            break;
        }
        case "contact": {
            set.tint = [195, 205, 179];
            set.name = "FINAL TRANSMISSION / 07";
            for (let i = 4; i >= 0; i--) {
                const z = 340 + i * 245, gap = 18 + i * 5;
                slab(m, [[-400 - i * 25, -650], [-gap, -475], [-gap, 460], [-360 - i * 25, 680]], z, 125, 30 + i * 4, 0, 0, i < 2);
                slab(m, [[gap, -475], [510 + i * 30, -680], [560 + i * 30, 720], [gap, 460]], z, 145, 36 + i * 5, 0, 0, i < 2);
                plate(m, -gap + 2, -452, 4, 890, z - 3, 5, 172 - i * 12, 0, 0, i < 2);
            }
            route(m, [-220, 640, 320], [-8, 460, 1500], 3, 86);
            route(m, [430, 640, 320], [8, 460, 1500], 3, 86);
            break;
        }
    }
    m.sort((a, b) => b.depth - a.depth);
    sets.set(chapter, set);
    return set;
}
function project(object: Mesh, s: SceneInput, chapter: Chapter) {
    const p = object.projected;
    const time = s.reduced || s.quiet ? 0 : s.time;
    const cameraX = s.quiet ? 0 : s.pointerX * 1.65;
    const cameraY = s.quiet ? 0 : s.pointerY * 1.5;
    const travel = s.quiet ? 0 : s.progress * (chapter === "codex" ? 100 : chapter === "work" ? 55 : chapter === "about" ? 42 : 34);
    const aspect = s.viewportAspect || (s.mobile ? .58 : 1.5);
    const lensX = 1.5 / aspect;
    const focal = s.mobile ? 660 : 760;
    const anchor = s.mobile ? 1000 : 865;
    // Small mechanical movements are separated by long resting intervals.
    const cycle = (time + object.phase * .7) % 16;
    const wake = cycle < 4 ? Math.sin(cycle / 4 * Math.PI) ** 2 : 0;
    const drift = Math.sin(time * (chapter === "now" ? .63 : .16) + object.phase) * object.motion * 2.2 * wake;
    for (let i = 0; i < object.vertices.length; i++) {
        const v = object.vertices[i], depth = Math.max(140, v[2] + 540 - travel);
        const scale = focal / depth;
        p[i * 3] = anchor + (v[0] - cameraX + drift) * scale * lensX;
        p[i * 3 + 1] = 390 + (v[1] - cameraY + travel * .22) * scale;
        p[i * 3 + 2] = scale;
    }
}
function facePath(c: C, p: Float32Array, face: Face) {
    c.beginPath();
    const first = face.indices[0] * 3;
    c.moveTo(p[first], p[first + 1]);
    for (let i = 1; i < face.indices.length; i++) {
        const n = face.indices[i] * 3;
        c.lineTo(p[n], p[n + 1]);
    }
    c.closePath();
}
function paintMesh(c: C, object: Mesh, tint: Set["tint"], s: SceneInput, chapter: Chapter) {
    project(object, s, chapter);
    const p = object.projected;
    const haze = Math.min(.56, object.depth / 4000);
    for (const face of object.faces) {
        const tone = face.tone, r = Math.round(tone * tint[0] / 180), g = Math.round(tone * tint[1] / 180), b = Math.round(tone * tint[2] / 180);
        facePath(c, p, face);
        c.fillStyle = `rgb(${r},${g},${b})`;
        c.fill();
        c.strokeStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${.26 - haze * .2})`;
        c.lineWidth = .65;
        c.stroke();
        if (face.hatch) {
            c.save();
            c.clip();
            const a = face.indices[0] * 3, b1 = face.indices[1] * 3;
            const last = face.indices[face.indices.length - 1] * 3;
            const lines = chapter === "brain" ? 14 : chapter === "about" ? 20 : 8;
            c.strokeStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${chapter === "about" ? .13 : .18})`;
            c.lineWidth = .55;
            c.beginPath();
            for (let j = 1; j < lines; j++) {
                const t = j / lines;
                const x = p[a] + (p[last] - p[a]) * t, y = p[a + 1] + (p[last + 1] - p[a + 1]) * t;
                c.moveTo(x, y);
                c.lineTo(x + p[b1] - p[a], y + p[b1 + 1] - p[a + 1]);
            }
            c.stroke();
            // Material grain belongs to each projected face; it never floats over the UI.
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (const index of face.indices) {
                const n = index * 3;
                minX = Math.min(minX, p[n]);
                maxX = Math.max(maxX, p[n]);
                minY = Math.min(minY, p[n + 1]);
                maxY = Math.max(maxY, p[n + 1]);
            }
            c.fillStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${chapter === "about" ? .23 : .14})`;
            const size = Math.max(.4, p[a + 2] * .85);
            for (let j = 0; j < surfaceGrain.length; j += 2) {
                const x = minX + (maxX - minX) * surfaceGrain[j];
                const y = minY + (maxY - minY) * surfaceGrain[j + 1];
                c.fillRect(x, y, chapter === "about" ? size * 3 : size, size);
            }
            if (chapter === "about") {
                c.strokeStyle = "#d7c4ac30";
                c.lineWidth = .65;
                c.beginPath();
                for (let j = 1; j < 9; j++) {
                    const y = minY + (maxY - minY) * j / 10;
                    c.moveTo(minX + 18, y);
                    c.lineTo(maxX - 24, y + 9);
                }
                c.stroke();
            }
            if (chapter !== "contact" && object.vertices.length <= 16) {
                c.fillStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},.4)`;
                for (let j = 1; j < 6; j++) {
                    const t = j / 7, x = p[a] + (p[b1] - p[a]) * t, y = p[a + 1] + (p[b1 + 1] - p[a + 1]) * t;
                    c.fillRect(x, y + 7, Math.max(1, 5 * p[a + 2]), 1);
                }
            }
            c.restore();
        }
    }
    if (object.label && (!s.mobile || object.depth < 800)) {
        const n = object.faces[object.faces.length - 1].indices[0] * 3;
        c.fillStyle = "#d3d4cb88";
        c.font = `${Math.max(7, 11 * p[n + 2])}px monospace`;
        c.letterSpacing = "1px";
        c.fillText(object.label, p[n] + 12, p[n + 1] + 23);
    }
    if (object.signal) {
        const t = s.reduced || s.quiet ? .35 : (s.time * (chapter === "now" ? .13 : .045)) % 1;
        const ax = (p[0] + p[9]) * .5, ay = (p[1] + p[10]) * .5;
        const bx = (p[3] + p[6]) * .5, by = (p[4] + p[7]) * .5;
        c.fillStyle = "#e3e8d8";
        c.beginPath(); c.arc(ax + (bx - ax) * t, ay + (by - ay) * t, Math.max(1.5, p[2] * 4), 0, TAU); c.fill();
    }
}
export function drawEnvironment(c: C, chapter: Chapter, s: SceneInput) {
    const set = sets.get(chapter) || build(chapter);
    const still = s.reduced || s.quiet;
    const lightX = still ? 0 : Math.sin(s.time * .14) * 12 + s.pointerX * 12;
    const lightY = still ? 0 : Math.sin(s.time * .14) * 7 + s.pointerY * 5;
    const light = c.createRadialGradient(965 + lightX, 355 + lightY, 20, 925 + lightX, 415 + lightY, 700);
    light.addColorStop(0, "#4444443d");
    light.addColorStop(1, "#080a0b00");
    c.fillStyle = light;
    c.fillRect(0, 0, 1200, 800);
    c.strokeStyle = "#b2bec229";
    c.lineWidth = .6;
    c.beginPath();
    c.moveTo(730, 123);
    c.lineTo(1180, 123);
    c.moveTo(1130, 110);
    c.lineTo(1130, 680);
    c.stroke();
    for (const object of set.meshes)
        if (!s.mobile || object.mobile)
            paintMesh(c, object, set.tint, s, chapter);
    if (chapter === "home") {
        c.save();
        c.fillStyle = "#d6d5c018";
        c.font = "800 290px Arial, sans-serif";
        c.letterSpacing = "-24px";
        c.fillText("AN", s.mobile ? 820 : 690, 570);
        c.restore();
    }
    if (chapter === "contact") {
        const light = c.createLinearGradient(850, 0, 970, 0);
        light.addColorStop(0, "#d9e1c600");
        light.addColorStop(.5, "#d9e1c61b");
        light.addColorStop(1, "#d9e1c600");
        c.fillStyle = light;
        c.fillRect(s.mobile ? 960 : 830, 70, 120, 640);
    }
    const reading = c.createLinearGradient(0, 0, s.mobile ? 920 : 735, 0);
    reading.addColorStop(0, "#060809f5");
    reading.addColorStop(.55, "#060809ba");
    reading.addColorStop(1, "#06080900");
    c.fillStyle = reading;
    c.fillRect(0, 0, s.mobile ? 920 : 735, 800);
    if (s.quiet) {
        c.fillStyle = "#070a0ce0";
        c.fillRect(0, 0, 1200, 800);
    }
    c.fillStyle = "#b7c0bc78";
    c.font = "9px monospace";
    c.letterSpacing = "1.5px";
    c.fillText(set.name, s.mobile ? 740 : 790, 745);
}
