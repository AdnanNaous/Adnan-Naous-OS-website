"use client";

import { useEffect, useRef } from "react";

/** A continuous, original WebGL environment. No backdrop image or game asset. */
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
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
      } catch {
        host.dataset.fallback = "true";
        announceReady();
        return;
      }

      const media = matchMedia("(prefers-reduced-motion: reduce)");
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.45 : 1.8));
      renderer.setClearColor(0x090909);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.16;
      renderer.shadowMap.enabled = innerWidth >= 900 && !media.matches;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x090909, 0.025);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 110);
      camera.position.set(0, 1.0, 18);
      camera.lookAt(0, 0, 0);
      // One high, near-side key makes the metal planes readable. A quiet rim
      // separates the silhouette without filling in its cast shadows.
      scene.add(new THREE.HemisphereLight(0xd8d8d8, 0x101010, 0.62));
      const key = new THREE.DirectionalLight(0xffffff, 3.6);
      key.position.set(-5, 8, 9);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -10;
      key.shadow.camera.right = 10;
      key.shadow.camera.top = 10;
      key.shadow.camera.bottom = -10;
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 35;
      key.shadow.bias = -0.0002;
      key.shadow.normalBias = 0.025;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc8c8c8, 1.1);
      rim.position.set(6, 4, -7);
      scene.add(rim);
      const bounce = new THREE.DirectionalLight(0x9a9a9a, 0.42);
      bounce.position.set(4, -3, 5);
      scene.add(bounce);

      const world = new THREE.Group();
      scene.add(world);
      const steel = new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.38, roughness: 0.38, clearcoat: 0.24, clearcoatRoughness: 0.32 });
      const graphite = new THREE.MeshStandardMaterial({ color: 0x393939, metalness: 0.18, roughness: 0.68 });
      const bright = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.3, roughness: 0.34, emissive: 0x303030, emissiveIntensity: 0.08 });
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x9b9b9b, metalness: 0.08, roughness: 0.24, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide });
      const resources: Array<{ dispose: () => void }> = [steel, graphite, bright, glass];

      // The core is built as one architectural object: an inner spine, glass shell,
      // concentric machined bands, and hinged radial vanes.
      const spineGeometry = new THREE.CylinderGeometry(0.31, 0.58, 6.8, 7);
      const spine = new THREE.Mesh(spineGeometry, steel);
      spine.castShadow = true;
      spine.receiveShadow = true;
      spine.rotation.z = -0.1;
      world.add(spine);
      resources.push(spineGeometry);
      const shellGeometry = new THREE.CylinderGeometry(0.7, 0.8, 5.45, 8, 1, true);
      const shell = new THREE.Mesh(shellGeometry, glass);
      shell.rotation.z = -0.1;
      world.add(shell);
      resources.push(shellGeometry);
      const slitGeometry = new THREE.BoxGeometry(0.075, 5.8, 0.075);
      const slit = new THREE.Mesh(slitGeometry, bright);
      slit.castShadow = true;
      slit.position.set(-0.19, 0.08, 0.49);
      slit.rotation.z = -0.1;
      world.add(slit);
      resources.push(slitGeometry);

      const rings: InstanceType<typeof THREE.Mesh>[] = [];
      for (const [index, radius, tube, z] of [[0, 3.15, 0.075, 0], [1, 2.48, 0.045, 0.55], [2, 3.65, 0.025, -0.65]] as const) {
        const geometry = new THREE.TorusGeometry(radius, tube, 10, 112);
        const ring = new THREE.Mesh(geometry, index === 1 ? bright : steel);
        ring.castShadow = true;
        ring.receiveShadow = true;
        ring.rotation.set(0.22 + index * 0.31, -0.58 + index * 0.18, -0.26 + index * 0.22);
        ring.position.z = z;
        world.add(ring);
        rings.push(ring);
        resources.push(geometry);
      }

      // Brushed fasteners and travelling white energy traces add scale cues
      // without introducing a second palette or a separate visual object.
      const boltGeometry = new THREE.CylinderGeometry(0.045, 0.045, 0.025, 6);
      const bolts = new THREE.InstancedMesh(boltGeometry, bright, 32);
      const boltDummy = new THREE.Object3D();
      for (let i = 0; i < 32; i++) {
        const angle = i / 32 * Math.PI * 2;
        boltDummy.position.set(Math.cos(angle) * 3.13, Math.sin(angle) * 3.13, 0.13);
        boltDummy.rotation.set(Math.PI / 2, 0, angle);
        boltDummy.updateMatrix();
        bolts.setMatrixAt(i, boltDummy.matrix);
      }
      bolts.instanceMatrix.needsUpdate = true;
      world.add(bolts);
      resources.push(boltGeometry);

      const energy: InstanceType<typeof THREE.Mesh>[] = [];
      const energyMaterials: InstanceType<typeof THREE.MeshBasicMaterial>[] = [];
      for (let i = 0; i < 4; i++) {
        const geometry = new THREE.TorusGeometry(3.17 + i * 0.12, 0.012, 6, 40, 0.52 + i * 0.2);
        const material = new THREE.MeshBasicMaterial({ color: 0xf2f2f2, transparent: true, opacity: 0.25, depthWrite: false });
        const trace = new THREE.Mesh(geometry, material);
        trace.position.z = 0.17 + i * 0.03;
        trace.rotation.z = i * 1.7;
        world.add(trace);
        energy.push(trace);
        energyMaterials.push(material);
        resources.push(geometry, material);
      }

      const vaneGeometry = new THREE.BoxGeometry(0.14, 0.68, 0.28);
      const vanes = new THREE.InstancedMesh(vaneGeometry, graphite, 64);
      vanes.castShadow = true;
      vanes.receiveShadow = true;
      const dummy = new THREE.Object3D();
      for (let i = 0; i < 64; i++) {
        const angle = i / 64 * Math.PI * 2;
        const radius = 3.45 + Math.sin(i * 4.3) * 0.06;
        dummy.position.set(Math.sin(angle) * radius, Math.cos(angle) * radius, Math.sin(i * 1.9) * 0.12 - 0.12);
        dummy.rotation.set(0.12, 0.22, -angle);
        dummy.scale.set(1, 0.75 + (i % 5) * 0.16, 1);
        dummy.updateMatrix();
        vanes.setMatrixAt(i, dummy.matrix);
      }
      vanes.instanceMatrix.needsUpdate = true;
      world.add(vanes);
      resources.push(vaneGeometry);

      const architecture = new THREE.Group();
      scene.add(architecture);
      const wallGeometry = new THREE.BoxGeometry(0.22, 12, 1.2);
      const wall = new THREE.InstancedMesh(wallGeometry, graphite, 26);
      wall.castShadow = true;
      wall.receiveShadow = true;
      for (let i = 0; i < 26; i++) {
        const side = i % 2 ? -1 : 1;
        const depth = Math.floor(i / 2);
        dummy.position.set(side * (7.8 + depth * 0.37), -0.9, -4.5 - depth * 1.45);
        dummy.rotation.set(0, side * 0.18, 0);
        dummy.scale.set(1, 1 + (depth % 3) * 0.25, 1);
        dummy.updateMatrix();
        wall.setMatrixAt(i, dummy.matrix);
      }
      wall.instanceMatrix.needsUpdate = true;
      architecture.add(wall);
      resources.push(wallGeometry);

      const floorGeometry = new THREE.PlaneGeometry(160, 160);
      const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({ color: 0x181818, metalness: 0.04, roughness: 0.92 }));
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -5.1;
      scene.add(floor);
      resources.push(floorGeometry, floor.material);
      const grid = new THREE.GridHelper(150, 72, 0x666666, 0x333333);
      grid.position.y = -5.07;
      (grid.material as InstanceType<typeof THREE.Material>).transparent = true;
      (grid.material as InstanceType<typeof THREE.Material>).opacity = 0.045;
      scene.add(grid);
      resources.push(grid.geometry, grid.material as InstanceType<typeof THREE.Material>);

      // A transparent rear receiver lets the moving assembly throw a soft
      // silhouette onto the architecture, even while the object hovers.
      const catcherGeometry = new THREE.PlaneGeometry(22, 14);
      const catcherMaterial = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.34, depthWrite: false });
      const catcher = new THREE.Mesh(catcherGeometry, catcherMaterial);
      catcher.position.set(0, 0, -2.8);
      catcher.receiveShadow = true;
      catcher.visible = renderer.shadowMap.enabled;
      scene.add(catcher);
      resources.push(catcherGeometry, catcherMaterial);

      const dustCount = innerWidth < 700 ? 45 : 75;
      const positions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0xb0b0b0, size: 0.024, transparent: true, opacity: 0.28, sizeAttenuation: true });
      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);
      resources.push(dustGeometry, dustMaterial);

      let frame = 0, lastFrame = 0, targetX = 0, targetY = 0, scrollProgress = 0;
      let pointerX = 0, pointerY = 0;
      const resize = () => {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        renderer.setPixelRatio(Math.min(devicePixelRatio, width < 700 ? 1.45 : 1.8));
        renderer.shadowMap.enabled = width >= 900 && !media.matches;
        catcher.visible = renderer.shadowMap.enabled;
        if (media.matches) renderer.render(scene, camera);
      };
      const onPointer = (event: PointerEvent) => {
        if (media.matches || event.pointerType !== "mouse") return;
        pointerX = event.clientX / innerWidth - 0.5;
        pointerY = event.clientY / innerHeight - 0.5;
      };
      const onScroll = () => {
        scrollProgress = media.matches ? 0 : Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
      };
      const draw = (time: number) => {
        if (document.hidden) return;
        if (time - lastFrame > 25 || media.matches) {
          const mobile = innerWidth < 700;
          const side = document.documentElement.dir === "rtl" ? -1 : 1;
          targetX = mobile ? 0 : side * (3.3 - scrollProgress * 1.5);
          targetY = mobile ? -2.3 + scrollProgress * 1.8 : 0.1 + scrollProgress * 0.9;
          const ease = media.matches ? 1 : 0.035;
          world.position.x += (targetX + pointerX * (mobile ? 0 : 0.7) - world.position.x) * ease;
          world.position.y += (targetY - pointerY * 0.38 - world.position.y) * ease;
          const targetScale = mobile ? 0.74 : 1.02;
          world.scale.setScalar(targetScale);
          const tick = media.matches ? 0 : time * 0.00012;
          world.rotation.y += ((scrollProgress * 0.5 + pointerX * 0.16 + tick * 0.55) - world.rotation.y) * 0.025;
          world.rotation.z += ((scrollProgress * -0.18 + pointerY * 0.08) - world.rotation.z) * 0.03;
          rings[0].rotation.z = -0.26 + tick * 0.24;
          rings[1].rotation.z = -0.04 - tick * 0.34;
          rings[2].rotation.z = 0.18 + tick * 0.13;
          energy.forEach((trace, index) => {
            trace.rotation.z = index * 1.7 + tick * (index % 2 ? -0.22 : 0.3);
            energyMaterials[index].opacity = media.matches ? 0.32 : 0.16 + (Math.sin(tick * 4 + index * 1.9) + 1) * 0.15;
          });
          dust.rotation.y = tick * 0.05;
          renderer.render(scene, camera);
          lastFrame = time;
        }
        if (!media.matches) frame = requestAnimationFrame(draw);
      };
      const onVisibility = () => { cancelAnimationFrame(frame); if (!document.hidden) frame = requestAnimationFrame(draw); };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      addEventListener("pointermove", onPointer, { passive: true });
      addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      const contextLost = (event: Event) => { event.preventDefault(); cancelAnimationFrame(frame); host.dataset.fallback = "true"; };
      renderer.domElement.addEventListener("webglcontextlost", contextLost);
      resize();
      onScroll();
      renderer.render(scene, camera);
      host.dataset.ready = "true";
      announceReady();
      frame = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        removeEventListener("pointermove", onPointer);
        removeEventListener("scroll", onScroll);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.domElement.removeEventListener("webglcontextlost", contextLost);
        resources.forEach(resource => resource.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => { host.dataset.fallback = "true"; announceReady(); });

    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="live-world" ref={mount} aria-hidden="true" />;
}
