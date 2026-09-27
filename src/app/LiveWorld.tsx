"use client";

import { useEffect, useRef } from "react";

const CHAPTERS = ["home", "work", "now", "codex", "about", "contact"] as const;

/** An authored passage: scroll determines a reversible camera position in one scene. */
export default function LiveWorld() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};
    const announceReady = () => window.dispatchEvent(new Event("portfolio-scene-ready"));

    import("three").then((THREE) => {
      if (disposed) return;
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      } catch {
        host.dataset.fallback = "true";
        announceReady();
        return;
      }
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.28;
      renderer.setClearColor(0x090909);
      host.appendChild(renderer.domElement);
      const resources: Array<{ dispose: () => void }> = [];
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x090909);
      scene.fog = new THREE.FogExp2(0x090909, 0.013);
      const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 140);
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);
      resources.push(boxGeometry, cylinderGeometry);
      const mat = (color: number, metalness = 0.3, roughness = 0.6) => {
        const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
        resources.push(value);
        return value;
      };
      const dark = mat(0x181818, 0.12, 0.87);
      const graphite = mat(0x383838, 0.48, 0.62);
      const steel = mat(0x858585, 0.66, 0.34);
      const pale = mat(0xc8c8c8, 0.4, 0.39);
      const glass = mat(0x313131, 0.27, 0.24);
      const line = new THREE.MeshBasicMaterial({ color: 0xd0d0d0, toneMapped: false });
      resources.push(line);
      const block = (parent: InstanceType<typeof THREE.Object3D>, material: InstanceType<typeof THREE.Material>, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
        const mesh = new THREE.Mesh(boxGeometry, material);
        mesh.position.set(x, y, z);
        mesh.scale.set(sx, sy, sz);
        parent.add(mesh);
        return mesh;
      };
      const blocks = (parent: InstanceType<typeof THREE.Object3D>, material: InstanceType<typeof THREE.Material>, transforms: number[][]) => {
        const mesh = new THREE.InstancedMesh(boxGeometry, material, transforms.length);
        const dummy = new THREE.Object3D();
        transforms.forEach(([x, y, z, sx, sy, sz], index) => {
          dummy.position.set(x, y, z);
          dummy.scale.set(sx, sy, sz);
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        parent.add(mesh);
        return mesh;
      };
      const station = (z: number) => {
        const group = new THREE.Group();
        group.position.z = z;
        scene.add(group);
        return group;
      };
      const portal = (parent: InstanceType<typeof THREE.Object3D>, z: number, width: number, height: number, material: InstanceType<typeof THREE.Material>) => {
        block(parent, material, -width / 2, height / 2 - 3.1, z, 0.32, height, 0.8);
        block(parent, material, width / 2, height / 2 - 3.1, z, 0.32, height, 0.8);
        block(parent, material, 0, height - 3.1, z, width + 0.3, 0.36, 0.8);
        block(parent, line, -width / 2 + 0.2, height / 2 - 3.1, z + 0.42, 0.035, height - 0.2, 0.035);
        block(parent, line, width / 2 - 0.2, height / 2 - 3.1, z + 0.42, 0.035, height - 0.2, 0.035);
      };

      // Widely spaced structural gates retain depth without becoming a grid wall.
      block(scene, dark, 0, -3.35, -39, 34, 0.45, 105);
      const ribTransforms: number[][] = [];
      const railTransforms: number[][] = [];
      for (let i = 0; i < 15; i++) {
        const z = 8 - i * 7;
        ribTransforms.push([-8.6, 0.55, z, 0.14, 8, 0.24], [8.6, 0.55, z, 0.14, 8, 0.24]);
        if (i % 3 === 0) ribTransforms.push([0, 4.55, z, 17.4, 0.12, 0.24]);
      }
      for (let i = 0; i < 42; i++) ribTransforms.push([i % 2 ? -5.5 : 5.5, -3.09, 8 - i * 2.45, 0.12, 0.02, 0.9]);
      railTransforms.push([-8.3, -2.55, -41, 0.025, 0.025, 100], [8.3, -2.55, -41, 0.025, 0.025, 100]);
      blocks(scene, graphite, ribTransforms);
      blocks(scene, line, railTransforms);

      // Home: a monumental entry with luminous machined edges.
      const home = station(0);
      portal(home, -2, 7.5, 6.9, steel);
      block(home, glass, 3.45, 0.1, -2.25, 0.55, 5.1, 1.5);
      for (let i = 0; i < 5; i++) block(home, pale, 3.92, 2.2 - i * 0.9, -1.38, 0.11, 0.3, 0.03);
      block(home, line, 0, -2.75, -1.9, 3.8, 0.055, 0.1);

      // Work: a curled drawing surface, built from continuous concentric wire.
      const work = station(-17);
      portal(work, -2, 9.8, 7.5, graphite);
      const leaves = new THREE.Group();
      leaves.position.set(5.1, 0.1, 0.5);
      work.add(leaves);
      for (let i = 0; i < 12; i++) {
        const geometry = new THREE.TorusGeometry(1.1 + i * 0.16, i % 3 === 0 ? 0.025 : 0.012, 5, 88, Math.PI * (1.16 + i * 0.025));
        const wire = new THREE.Mesh(geometry, i % 3 === 0 ? pale : line);
        wire.position.z = -i * 0.12;
        wire.rotation.set(0.25 + i * 0.018, -0.52, 0.34 + i * 0.15);
        leaves.add(wire);
        resources.push(geometry);
      }
      block(work, steel, 4.25, -2.72, -2.8, 5.3, 0.16, 2.8);
      for (let i = 0; i < 5; i++) block(work, line, 2.1 + i * 1.08, -2.61, -1.38, 0.4, 0.025, 0.035);

      // Now: a physical work table with a stepped set of active modules.
      const now = station(-34);
      block(now, graphite, 5.4, -2.45, -2, 6.5, 0.24, 3.8);
      for (let i = 0; i < 4; i++) {
        const h = 0.65 + i * 0.35;
        block(now, i === 2 ? pale : glass, 3.25 + i * 1.38, -2.25 + h / 2, -2.1 - i * 0.2, 0.72, h, 0.75);
        block(now, line, 3.25 + i * 1.38, -2.18 + h, -1.7 - i * 0.2, 0.55, 0.026, 0.028);
      }
      for (let i = 0; i < 7; i++) block(now, i === 3 ? line : steel, 2.1 + i * 0.8, -2.3, -0.5, 0.025, 0.03, 2.6);
      portal(now, -2, 9.6, 7, graphite);

      // Codex: a rail-lined core, with circuit-like light travelling in depth.
      const codex = station(-51);
      portal(codex, -1.5, 8.5, 8.2, steel);
      const core = new THREE.Mesh(cylinderGeometry, graphite);
      core.position.set(3.25, -0.2, -2.5);
      core.scale.set(0.55, 5.5, 0.55);
      codex.add(core);
      for (let i = 0; i < 7; i++) {
        const geometry = new THREE.TorusGeometry(0.78 + i * 0.16, 0.018, 5, 64, Math.PI * 1.73);
        const ring = new THREE.Mesh(geometry, i % 2 ? pale : line);
        ring.position.set(3.25, -0.2, -2.5 - i * 0.25);
        ring.rotation.z = i * 0.39;
        codex.add(ring);
        resources.push(geometry);
      }
      for (let i = 0; i < 9; i++) {
        const y = -2.55 + i * 0.58;
        block(codex, line, 3.25, y, -1.88, 0.76, 0.032, 0.035);
        block(codex, pale, -3.6, y, -2.1 - (i % 3) * 0.25, 1.9, 0.06, 0.12);
      }

      // About: an open archive; shelf depth becomes visible as the camera passes.
      const about = station(-68);
      for (let row = 0; row < 2; row++) for (let level = 0; level < 4; level++) {
        const x = row ? 4.1 : -4.1;
        block(about, steel, x, -2.65 + level * 1.35, -2.2, 4.1, 0.13, 2.1);
        for (let j = 0; j < 6; j++) block(about, (j + level) % 4 === 0 ? pale : glass, x - 1.65 + j * 0.64, -2.07 + level * 1.35, -2.2, 0.4, 1.05, 0.76);
      }
      portal(about, -5, 10.8, 8.3, graphite);

      // Contact: a bright exit cut into the same architecture.
      const contact = station(-85);
      portal(contact, -4.5, 11, 8.5, steel);
      block(contact, dark, 0, 0.52, -5.15, 7.4, 7.2, 0.28);
      block(contact, glass, 0, 0.52, -4.92, 6.85, 6.7, 0.08);
      block(contact, line, 0, -2.88, -4.72, 4.8, 0.055, 0.07);
      for (let i = 0; i < 8; i++) block(contact, line, -3.1 + i * 0.89, 3.76, -4.7, 0.45, 0.04, 0.07);

      scene.add(new THREE.HemisphereLight(0xd5d5d5, 0x181818, 1.15));
      const key = new THREE.DirectionalLight(0xffffff, 2.6);
      key.position.set(-6, 9, 7);
      scene.add(key);
      for (let i = 0; i < CHAPTERS.length; i++) {
        const point = new THREE.PointLight(0xffffff, 42, 18, 1.5);
        point.position.set(i % 2 ? -3.5 : 4, 2.1, -i * 17 - 1);
        scene.add(point);
      }

      const shots = [
        { p: [0, 0.45, 12.8], t: [2.3, 0.2, -3.5], roll: -0.035 },
        { p: [-1.55, 1.15, -4.2], t: [2.25, 0.0, -20], roll: 0.025 },
        { p: [1.2, 1.9, -21.3], t: [2.1, -0.5, -36], roll: -0.025 },
        { p: [-1.4, 0.7, -38.2], t: [2.5, 0.0, -54], roll: 0.03 },
        { p: [0.8, 0.2, -55.1], t: [-1.4, -0.4, -72], roll: -0.02 },
        { p: [0, 0.6, -74.2], t: [0, 0.4, -90], roll: 0 },
      ];
      const anchors = new Array<number>(CHAPTERS.length).fill(0);
      const desiredPosition = new THREE.Vector3();
      const desiredLook = new THREE.Vector3();
      const currentLook = new THREE.Vector3();
      let progress = 0, pointerX = 0, pointerY = 0, frame = 0, lastTime = 0;
      let active = false, contextLost = false;
      const measure = () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
        CHAPTERS.forEach((id, index) => {
          const section = document.getElementById(id);
          anchors[index] = index === 0 ? 0 : Math.min(maxScroll, Math.max(0, (section?.getBoundingClientRect().top ?? 0) + scrollY - innerHeight * 0.42));
        });
        for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
      };
      const readScroll = () => {
        if (reduced.matches) { progress = 0; host.dataset.chapter = "home"; return; }
        const previous = progress;
        let index = 0;
        while (index < anchors.length - 2 && scrollY >= anchors[index + 1]) index++;
        progress = Math.min(CHAPTERS.length - 1, index + THREE.MathUtils.clamp((scrollY - anchors[index]) / (anchors[index + 1] - anchors[index]), 0, 1));
        host.dataset.chapter = CHAPTERS[Math.round(progress)];
        if (Math.abs(progress - previous) > 0.0001) schedule();
      };
      const render = (damping: number) => {
        const chapter = Math.min(shots.length - 2, Math.floor(progress));
        const raw = progress - chapter;
        const blend = raw * raw * (3 - 2 * raw);
        const a = shots[chapter], b = shots[chapter + 1];
        const mix = (x: number, y: number) => THREE.MathUtils.lerp(x, y, blend);
        const mobile = host.clientWidth < 700;
        const side = document.documentElement.dir === "rtl" ? -1 : 1;
        desiredPosition.set(mix(a.p[0], b.p[0]), mix(a.p[1], b.p[1]), mix(a.p[2], b.p[2]));
        desiredLook.set(mix(a.t[0], b.t[0]), mix(a.t[1], b.t[1]), mix(a.t[2], b.t[2]));
        desiredPosition.x += (mobile ? 1.1 : 0.55) * side;
        desiredLook.x += (mobile ? 1.1 : 0.55) * side;
        if (!reduced.matches && !mobile) { desiredPosition.x += pointerX * 0.22; desiredPosition.y -= pointerY * 0.14; }
        camera.position.lerp(desiredPosition, damping);
        currentLook.lerp(desiredLook, damping);
        camera.lookAt(currentLook);
        camera.rotation.z += (mix(a.roll, b.roll) - camera.rotation.z) * damping;
        renderer.render(scene, camera);
      };
      const resize = () => {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(devicePixelRatio, width < 700 ? 1.2 : 1.7));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.fov = width < 700 ? 61 : 49;
        camera.updateProjectionMatrix();
        measure();
        readScroll();
        if (reduced.matches) render(1);
        else schedule();
      };
      const animate = (time: number) => {
        frame = 0;
        if (!active || contextLost) return;
        const delta = Math.min(0.05, Math.max(0, (time - lastTime) / 1000));
        lastTime = time;
        render(1 - Math.exp(-4.8 * delta));
        if (camera.position.distanceToSquared(desiredPosition) > 0.00001 || currentLook.distanceToSquared(desiredLook) > 0.00001) schedule();
      };
      const schedule = () => {
        if (!frame && active && !contextLost) { lastTime = lastTime || performance.now(); frame = requestAnimationFrame(animate); }
      };
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse" || reduced.matches) return;
        pointerX = event.clientX / innerWidth - 0.5;
        pointerY = event.clientY / innerHeight - 0.5;
        schedule();
      };
      const onVisibility = () => {
        active = !document.hidden && !reduced.matches;
        cancelAnimationFrame(frame);
        frame = 0;
        if (active && !contextLost) { lastTime = performance.now(); schedule(); }
      };
      const onMotion = () => { readScroll(); onVisibility(); if (reduced.matches && !contextLost) render(1); };
      const onContextLost = (event: Event) => { event.preventDefault(); contextLost = true; cancelAnimationFrame(frame); host.dataset.fallback = "true"; };
      const onContextRestored = () => { contextLost = false; delete host.dataset.fallback; resize(); onVisibility(); };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      const contentObserver = new ResizeObserver(() => { measure(); readScroll(); });
      contentObserver.observe(document.documentElement);
      addEventListener("resize", resize);
      addEventListener("scroll", readScroll, { passive: true });
      addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      reduced.addEventListener("change", onMotion);
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      renderer.domElement.addEventListener("webglcontextrestored", onContextRestored);
      resize();
      readScroll();
      render(1);
      host.dataset.ready = "true";
      announceReady();
      onVisibility();
      cleanup = () => {
        active = false;
        cancelAnimationFrame(frame);
        observer.disconnect(); contentObserver.disconnect();
        removeEventListener("resize", resize);
        removeEventListener("scroll", readScroll);
        removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        reduced.removeEventListener("change", onMotion);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        renderer.domElement.removeEventListener("webglcontextrestored", onContextRestored);
        resources.forEach((resource) => resource.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) { host.dataset.fallback = "true"; announceReady(); } });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="live-world" ref={mount} aria-hidden="true" />;
}
