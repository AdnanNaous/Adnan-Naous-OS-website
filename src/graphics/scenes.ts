import type { Chapter } from "../motion/runtime";
import { drawEnvironment } from "./scenes/environment";
export type SceneInput = {
    time: number;
    progress: number;
    velocity: number;
    pointerX: number;
    pointerY: number;
    mobile: boolean;
    reduced: boolean;
    quiet: boolean;
    pointerForce?: number;
    pointerVelocityX?: number;
    pointerVelocityY?: number;
    viewportAspect?: number;
};
type C = CanvasRenderingContext2D;
/** The engine changes this opaque set only while its shutter covers the viewport. */
export function paintChapter(c: C, chapter: Chapter, input: SceneInput, alpha: number) {
    if (alpha <= .001)
        return;
    c.save();
    c.globalAlpha = alpha;
    c.fillStyle = "#080a0b";
    c.fillRect(0, 0, 1200, 800);
    drawEnvironment(c, chapter, input);
    c.restore();
}
export function paintSignal(c: C, input: SceneInput, outgoing: number) {
    if (input.reduced || input.quiet)
        return;
    const energy = Math.min(1, Math.max(input.pointerForce || 0, outgoing * .4));
    if (energy < .04)
        return;
    c.save();
    c.globalAlpha = energy * .25;
    c.lineWidth = .7;
    c.strokeStyle = "#b6cdd1";
    c.beginPath();
    c.moveTo(1170, 110);
    c.lineTo(1162, 350);
    c.stroke();
    c.strokeStyle = "#cab99e";
    c.beginPath();
    c.moveTo(1173, 110);
    c.lineTo(1165, 350);
    c.stroke();
    c.restore();
}
export function paintFinish(c: C, input: SceneInput) {
    const shade = c.createLinearGradient(0, 0, 0, 800);
    shade.addColorStop(0, "#05060660");
    shade.addColorStop(.23, "#05060600");
    shade.addColorStop(.76, "#05060600");
    shade.addColorStop(1, "#050606a6");
    c.fillStyle = shade;
    c.fillRect(0, 0, 1200, 800);
    if (!input.mobile) {
        c.strokeStyle = "#c8cac733";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(42, 56);
        c.lineTo(42, 38);
        c.lineTo(134, 38);
        c.moveTo(1070, 762);
        c.lineTo(1158, 762);
        c.lineTo(1158, 744);
        c.stroke();
    }
}
