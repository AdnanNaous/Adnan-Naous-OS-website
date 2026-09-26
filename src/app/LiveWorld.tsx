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
      renderer.toneMappingExposure = 1.18;
      renderer.shadowMap.enabled = innerWidth >= 900 && !media.matches;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x090909, 0.025);
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 110);
      camera.position.set(0, 1.0, 18);
      camera.lookAt(0, 0, 0);
      scene.add(new THREE.AmbientLight(0xa4a4a4, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 3.15);
      key.position.set(-5, 9, 9);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -11;
      key.shadow.camera.right = 11;
      key.shadow.camera.top = 11;
      key.shadow.camera.bottom = -11;
      key.shadow.camera.near = 1;
      key.shadow.camera.far = 35;
      key.shadow.bias = -0.0005;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc8c8c8, 3.2);
      rim.position.set(7, 3, -6);
      scene.add(rim);
      const lower = new THREE.PointLight(0xf2f2f2, 28, 19, 2);
      lower.position.set(3, -4, 4);
      scene.add(lower);

      const world = new THREE.Group();
      scene.add(world);
      const steel = new THREE.MeshPhysicalMaterial({ color: 0x5b5b5b, metalness: 0.87, roughness: 0.25, clearcoat: 0.72, clearcoatRoughness: 0.17 });
      const graphite = new THREE.MeshStandardMaterial({ color: 0x191919, metalness: 0.75, roughness: 0.4 });
      const bright = new THREE.MeshStandardMaterial({ color: 0xd6d6d6, metalness: 0.64, roughness: 0.27, emissive: 0x606060, emissiveIntensity: 0.24 });
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x929292, metalness: 0.16, roughness: 0.1, transparent: true, opacity: 0.42, transmission: 0.26, thickness: 0.8, clearcoat: 1, clearcoatRoughness: 0.08, side: THREE.DoubleSide });
      const resources: Array<{ dispose: () => void }> = [steel, graphite, bright, glass];

      // The core is built as one architectural object: an inner spine, glass shell,
      // concentric machined bands, and hinged radial vanes.
      const spineGeometry = new THREE.CylinderGeometry(0.31, 0.58, 6.8, 7);
      const spine = new THREE.Mesh(spineGeometry, steel);
      spine.castShadow = true;
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
      const floor = new THREE.Mesh(floorGeometry, new THREE.MeshStandardMaterial({ color: 0x121212, metalness: 0.48, roughness: 0.55 }));
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -5.1;
      scene.add(floor);
      resources.push(floorGeometry, floor.material);
      const grid = new THREE.GridHelper(150, 72, 0x666666, 0x333333);
      grid.position.y = -5.07;
      (grid.material as InstanceType<typeof THREE.Material>).transparent = true;
      (grid.material as InstanceType<typeof THREE.Material>).opacity = 0.13;
      scene.add(grid);
      resources.push(grid.geometry, grid.material as InstanceType<typeof THREE.Material>);

      // White volumetric shafts are actual translucent geometry, not a photo overlay.
      const beamMaterial = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uOpacity: { value: 0.12 } },
        vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
        fragmentShader: "varying vec2 vUv;uniform float uOpacity;void main(){float width=pow(max(0.0,1.0-abs(vUv.x-.5)*2.0),2.0);float fade=smoothstep(0.0,.35,vUv.y)*(1.0-smoothstep(.75,1.0,vUv.y));gl_FragColor=vec4(vec3(.86),width*fade*uOpacity);}",
      });
      resources.push(beamMaterial);
      const beams = new THREE.Group();
      for (let i = 0; i < 5; i++) {
        const geometry = new THREE.PlaneGeometry(5.4 + i * 0.4, 18);
        const beam = new THREE.Mesh(geometry, beamMaterial);
        beam.position.set((i - 2) * 2.15, 2.2, -6.6 - i * 0.55);
        beam.rotation.z = -0.19 + i * 0.095;
        beam.rotation.y = i * 0.18;
        beams.add(beam);
        resources.push(geometry);
      }
      scene.add(beams);

      const dustCount = innerWidth < 700 ? 110 : 190;
      const positions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      }
      const dustGeometry = new THREE.BufferGeometry();
      dustGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const dustMaterial = new THREE.PointsMaterial({ color: 0xd2d2d2, size: 0.032, transparent: true, opacity: 0.55, sizeAttenuation: true });
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
          beams.rotation.z = Math.sin(tick * 0.55) * 0.012;
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
