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
      scene.fog = new THREE.FogExp2(0x090909, 0.017);
      const camera = new THREE.PerspectiveCamera(49, 1, 0.1, 140);
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 12);
      resources.push(boxGeometry, cylinderGeometry);
      const mat = (color: number, metalness = 0.3, roughness = 0.6) => {
        const value = new THREE.MeshStandardMaterial({ color, metalness, roughness });
        resources.push(value);
        return value;
      };
      const graphite = mat(0x383838, 0.48, 0.62);
      const steel = mat(0x858585, 0.66, 0.34);
      const pale = mat(0xc8c8c8, 0.4, 0.39);
      const glass = mat(0x313131, 0.27, 0.24);
      const dark = mat(0x181818, 0.12, 0.87);
      const charcoal = mat(0x252525, 0.08, 0.91);
      const pewter = mat(0x777777, 0.53, 0.31);
      const white = new THREE.MeshBasicMaterial({ color: 0xe4e4e4, toneMapped: false, fog: false, transparent: true, opacity: 0, depthWrite: false });
      const whiteHaze = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, toneMapped: false, fog: false });
      resources.push(white, whiteHaze);
      const doorCanvas = document.createElement("canvas");
      doorCanvas.width = 256; doorCanvas.height = 512;
      const doorInk = doorCanvas.getContext("2d");
      if (doorInk) {
        const glow = doorInk.createLinearGradient(0, 0, 256, 0);
        glow.addColorStop(0, "#303030"); glow.addColorStop(.18, "#a0a0a0");
        glow.addColorStop(.5, "#ededed"); glow.addColorStop(.82, "#a0a0a0"); glow.addColorStop(1, "#303030");
        doorInk.fillStyle = glow; doorInk.fillRect(0, 0, 256, 512);
        for (let x = 8; x < 256; x += 24) { doorInk.fillStyle = x % 48 ? "#16161636" : "#ffffff36"; doorInk.fillRect(x, 0, x % 48 ? 7 : 2, 512); }
        const vertical = doorInk.createLinearGradient(0, 0, 0, 512);
        vertical.addColorStop(0, "#08080899"); vertical.addColorStop(.35, "#ffffff00"); vertical.addColorStop(1, "#10101066");
        doorInk.fillStyle = vertical; doorInk.fillRect(0, 0, 256, 512);
        const doorTexture = new THREE.CanvasTexture(doorCanvas);
        doorTexture.colorSpace = THREE.SRGBColorSpace;
        resources.push(doorTexture);
        white.map = doorTexture; white.color.set(0xffffff); white.needsUpdate = true;
      }
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

      // Retain the existing structural passage and add life at its stations.
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

      // Home: retain the original gate and put a quiet server room behind it.
      const home = station(0);
      portal(home, -2, 7.5, 6.9, steel);
      block(home, glass, 3.45, 0.1, -2.25, 0.55, 5.1, 1.5);
      for (let i = 0; i < 5; i++) block(home, pale, 3.92, 2.2 - i * 0.9, -1.38, 0.11, 0.3, 0.03);
      block(home, line, 0, -2.75, -1.9, 3.8, 0.055, 0.1);
      const rackFaces: number[][] = [];
      const rackSlots: number[][] = [];
      const statusLights: number[][] = [];
      for (const side of [-1, 1]) for (let row = 0; row < 4; row++) {
        const x = side * 6.7, z = -5.5 - row * 5.6;
        block(home, charcoal, x, -0.18, z, 1.9, 5.65, 2.15);
        block(home, steel, x - side * 1.02, -0.18, z, 0.055, 5.63, 2.12);
        rackFaces.push([x - side * 1.065, -0.18, z, 0.02, 5.25, 1.82]);
        for (let slot = 0; slot < 9; slot++) {
          const y = -2.48 + slot * 0.54;
          rackSlots.push([x - side * 1.085, y, z, 0.022, 0.025, 1.64]);
          if ((slot + row) % 3 === 0) statusLights.push([x - side * 1.11, y + 0.16, z + 0.7, 0.04, 0.035, 0.13]);
        }
      }
      blocks(home, glass, rackFaces);
      blocks(home, pewter, rackSlots);
      blocks(home, line, statusLights);
      for (const z of [-7, -17]) for (const offset of [-0.42, 0, 0.42]) {
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-6.7, 3.15, z + offset), new THREE.Vector3(-3.4, 4.08, z + offset),
          new THREE.Vector3(0, 4.25, z + offset), new THREE.Vector3(3.4, 4.08, z + offset),
          new THREE.Vector3(6.7, 3.15, z + offset),
        ]);
        const geometry = new THREE.TubeGeometry(curve, 28, offset === 0 ? 0.052 : 0.027, 5, false);
        resources.push(geometry);
        home.add(new THREE.Mesh(geometry, offset === 0 ? steel : graphite));
      }
      const rackLight = new THREE.PointLight(0xe8e8e8, 23, 13, 1.8);
      rackLight.position.set(0, 3.5, -9); home.add(rackLight);

      // Work: a folded steel ribbon, lit like a single gallery object.
      const work = station(-17);
      const leaves = new THREE.Group();
      leaves.position.set(5.1, 0.0, -0.5);
      work.add(leaves);
      for (let i = 0; i < 9; i++) {
        const geometry = new THREE.TorusGeometry(1.15 + i * 0.2, 0.045, 6, 76, Math.PI * (1.18 + i * 0.022));
        const wire = new THREE.Mesh(geometry, i % 3 === 0 ? pale : pewter);
        wire.position.z = -i * 0.24;
        wire.rotation.set(0.24 + i * 0.035, -0.55, 0.2 + i * 0.16);
        leaves.add(wire);
        resources.push(geometry);
      }
      block(work, charcoal, 5.2, -2.8, -1.7, 6.8, 0.5, 4.6);
      block(work, steel, 5.2, -2.52, -1.7, 6.3, 0.028, 4.1);
      block(work, line, 5.2, -2.49, 0.33, 5.1, 0.012, 0.02);
      const workLight = new THREE.SpotLight(0xffffff, 68, 20, 0.53, 0.72, 1.3);
      workLight.position.set(3.1, 5.8, 3); workLight.target.position.set(5.1, -1, -1.5);
      work.add(workLight, workLight.target);

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

      // About: interlocking arcs read as a quiet, unfinished personal monogram.
      const about = station(-68);
      const arcs = new THREE.Group(); arcs.position.set(-3.8, -0.2, -2.8); about.add(arcs);
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.TorusGeometry(1.8 + i * 0.24, 0.09, 8, 80, Math.PI * 1.42);
        const arc = new THREE.Mesh(geometry, i % 2 ? graphite : pewter);
        arc.rotation.set(0.06 * i, -0.12 * i, -0.34 + i * 0.17);
        arc.position.set(i * 0.11, i * 0.1, -i * 0.32);
        arcs.add(arc); resources.push(geometry);
      }
      block(about, charcoal, -3.4, -2.8, -3.4, 6.5, 0.45, 4.5);
      block(about, line, -3.4, -2.55, -1.16, 4.5, 0.012, 0.025);
      const aboutLight = new THREE.SpotLight(0xffffff, 54, 16, 0.52, 0.72, 1.4);
      aboutLight.position.set(-5.5, 5.5, 1); aboutLight.target.position.set(-3.5, -0.2, -3);
      about.add(aboutLight, aboutLight.target);

      // Contact: two heavy server-room leaves withdraw behind a matching frame.
      const contact = station(-85);
      const doorX = 2.8, doorZ = -5.8, doorWidth = 5.0, doorHeight = 6.7;
      block(contact, graphite, doorX - doorWidth / 2 - 0.18, 0.2, doorZ, 0.4, 7.2, 0.8);
      block(contact, graphite, doorX + doorWidth / 2 + 0.18, 0.2, doorZ, 0.4, 7.2, 0.8);
      block(contact, graphite, doorX, 3.75, doorZ, 5.75, 0.4, 0.8);
      block(contact, steel, doorX, 3.56, doorZ + 0.46, 4.9, 0.035, 0.05);
      block(contact, white, doorX, 0.2, doorZ - 0.3, doorWidth, doorHeight, 0.08);
      const doorLeft = new THREE.Group(), doorRight = new THREE.Group();
      doorLeft.position.set(doorX - doorWidth / 4, 0.2, doorZ + 0.1);
      doorRight.position.set(doorX + doorWidth / 4, 0.2, doorZ + 0.1);
      contact.add(doorLeft, doorRight);
      for (const [leaf, side] of [[doorLeft, -1], [doorRight, 1]] as const) {
        block(leaf, charcoal, 0, 0, 0, doorWidth / 2, doorHeight, 0.32);
        block(leaf, graphite, 0, 0, 0.18, doorWidth / 2 - 0.18, doorHeight - 0.2, 0.045);
        block(leaf, steel, -side * (doorWidth / 4 - 0.12), 0, 0.24, 0.055, doorHeight - 0.28, 0.055);
        for (let i = 0; i < 6; i++) block(leaf, i === 3 ? pale : pewter, 0, -2.4 + i * 0.94, 0.25, doorWidth / 2 - 0.55, 0.035, 0.025);
      }
      block(contact, pale, doorX, -3.105, doorZ + 2.5, 4.2, 0.012, 5.7);
      for (let i = 0; i < 3; i++) {
        const beam = block(contact, whiteHaze, doorX, -1.9 + i * 0.95, doorZ + 1.2 + i * 0.65, 4.4 + i * 1.6, 0.025, 6 + i * 1.5);
        beam.rotation.x = 0.08 + i * 0.03;
      }
      const exitLight = new THREE.PointLight(0xffffff, 0, 16, 1.3);
      exitLight.position.set(doorX, 0.8, doorZ + 0.8); contact.add(exitLight);

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
      const shade = document.querySelector<HTMLElement>(".world-shade");
      const contactSection = document.getElementById("contact");
      const contactContent = contactSection?.querySelector<HTMLElement>(".contact-content");
      const socialLine = contactContent?.querySelector<HTMLElement>(".social-line");
      const lightLayer = document.createElement("div");
      lightLayer.setAttribute("aria-hidden", "true");
      Object.assign(lightLayer.style, {
        position: "absolute", left: "0", top: "0", width: "100%", height: "100%", zIndex: "0", pointerEvents: "none",
        background: "linear-gradient(90deg, #525252, #cecece 42%, #888888 70%, #424242)",
        opacity: "0", visibility: "hidden", filter: "blur(1px)",
      });
      const foreground = Array.from(contactContent?.children ?? []).filter((element): element is HTMLElement => element instanceof HTMLElement).map((element) => ({ element, position: element.style.position, zIndex: element.style.zIndex }));
      foreground.forEach(({ element }) => { if (getComputedStyle(element).position === "static") element.style.position = "relative"; element.style.zIndex = "1"; });
      contactContent?.appendChild(lightLayer);
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
        // The door projection is viewport-relative even after the final camera stop.
        // Keep its light spill aligned while the contact section and footer scroll.
        if (Math.abs(progress - previous) > 0.0001 || progress > 4.55) schedule();
      };
      const render = (damping: number) => {
        const chapter = Math.min(shots.length - 2, Math.floor(progress));
        const raw = progress - chapter;
        const blend = raw * raw * (3 - 2 * raw);
        const a = shots[chapter], b = shots[chapter + 1];
        const mix = (x: number, y: number) => THREE.MathUtils.lerp(x, y, blend);
        const mobile = host.clientWidth < 700;
        desiredPosition.set(mix(a.p[0], b.p[0]), mix(a.p[1], b.p[1]), mix(a.p[2], b.p[2]));
        desiredLook.set(mix(a.t[0], b.t[0]), mix(a.t[1], b.t[1]), mix(a.t[2], b.t[2]));
        desiredPosition.x += mobile ? 1.1 : 0.55;
        desiredLook.x += mobile ? 1.1 : 0.55;
        if (!reduced.matches && !mobile) { desiredPosition.x += pointerX * 0.22; desiredPosition.y -= pointerY * 0.14; }
        camera.position.lerp(desiredPosition, damping);
        currentLook.lerp(desiredLook, damping);
        camera.lookAt(currentLook);
        camera.rotation.z += (mix(a.roll, b.roll) - camera.rotation.z) * damping;
        const doorOpen = THREE.MathUtils.smoothstep(progress, 4.42, 4.94);
        doorLeft.position.x = doorX - doorWidth / 4 - doorOpen * (doorWidth / 2 + 0.12);
        doorRight.position.x = doorX + doorWidth / 4 + doorOpen * (doorWidth / 2 + 0.12);
        white.opacity = 0.72 * doorOpen;
        whiteHaze.opacity = 0.1 * doorOpen;
        exitLight.intensity = 58 * doorOpen;
        const exposure = THREE.MathUtils.smoothstep(progress, 4.55, 4.96);
        if (shade) shade.style.opacity = String(1 - 0.78 * exposure);
        if (contactSection) contactSection.style.backgroundColor = `rgba(9,9,9,${0.55 - 0.43 * exposure})`;
        if (socialLine) socialLine.style.backgroundColor = `rgba(9,9,9,${0.88 * exposure})`;
        if (exposure > 0.001 && contactSection) {
          const contentRect = contactContent?.getBoundingClientRect();
          const project = (x: number, y: number) => {
            const point = new THREE.Vector3(x, y, contact.position.z + doorZ - 0.3).project(camera);
            return `${((point.x + 1) * host.clientWidth / 2 - (contentRect?.left ?? 0)).toFixed(1)}px ${((1 - point.y) * host.clientHeight / 2 - (contentRect?.top ?? 0)).toFixed(1)}px`;
          };
          const left = doorX - doorWidth / 2 + 0.18, right = doorX + doorWidth / 2 - 0.18;
          lightLayer.style.clipPath = `polygon(${project(left, 3.48)}, ${project(right, 3.48)}, ${project(right, -3.07)}, ${project(left, -3.07)})`;
          lightLayer.style.opacity = String(0.45 * exposure);
          lightLayer.style.visibility = "visible";
        } else {
          lightLayer.style.visibility = "hidden";
        }
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
        shade?.style.removeProperty("opacity");
        contactSection?.style.removeProperty("background-color");
        socialLine?.style.removeProperty("background-color");
        foreground.forEach(({ element, position, zIndex }) => { element.style.position = position; element.style.zIndex = zIndex; });
        lightLayer.remove();
        resources.forEach((resource) => resource.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => { if (!disposed) { host.dataset.fallback = "true"; announceReady(); } });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="live-world" ref={mount} aria-hidden="true" />;
}
