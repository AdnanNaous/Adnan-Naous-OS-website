"use client";

import { useEffect, useRef } from "react";

/** A decorative, real 3D star field. The portfolio remains usable without WebGL. */
export default function GalaxyScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    let cancelled = false;
    let cleanUp = () => {};

    import("three").then((THREE) => {
      if (cancelled) return;
      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
      camera.position.z = 12;
      const galaxy = new THREE.Group();
      scene.add(galaxy);

      // A soft circular particle, rather than the square points of a default WebGL demo.
      const particle = document.createElement("canvas");
      particle.width = particle.height = 64;
      const paint = particle.getContext("2d");
      if (paint) {
        const glow = paint.createRadialGradient(32, 32, 0, 32, 32, 31);
        glow.addColorStop(0, "rgba(255,255,255,1)");
        glow.addColorStop(0.14, "rgba(255,255,255,.95)");
        glow.addColorStop(0.45, "rgba(255,255,255,.23)");
        glow.addColorStop(1, "rgba(255,255,255,0)");
        paint.fillStyle = glow;
        paint.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(particle);
      const count = innerWidth < 700 ? 5000 : 9200;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const pale = new THREE.Color("#ebe5e6");
      const warm = new THREE.Color("#d8a995");
      const blue = new THREE.Color("#99a9d3");
      const color = new THREE.Color();

      for (let i = 0; i < count; i++) {
        const core = i < count * 0.16;
        const radius = core ? Math.pow(Math.random(), 1.45) * 0.85 : Math.sqrt(Math.random()) * 4.5 + 0.22;
        const arm = i % 4;
        const angle = arm * Math.PI / 2 + radius * 1.44 + (Math.random() - 0.5) * (core ? 5.7 : 0.26 + radius * 0.13);
        const scatter = (Math.random() - 0.5) * (0.11 + radius * 0.09);
        positions[i * 3] = Math.cos(angle) * radius + scatter;
        positions[i * 3 + 1] = Math.sin(angle) * radius * 0.69 + (Math.random() - 0.5) * (0.14 + radius * 0.12);
        positions[i * 3 + 2] = (Math.random() - 0.5) * (core ? 0.8 : 0.2 + radius * 0.21);
        if (core) color.copy(pale).lerp(warm, Math.random() * 0.24);
        else color.copy(i % 7 < 3 ? warm : blue).lerp(pale, Math.random() * 0.48);
        const brightness = core ? 0.84 : 0.42 + Math.random() * 0.48;
        colors[i * 3] = color.r * brightness;
        colors[i * 3 + 1] = color.g * brightness;
        colors[i * 3 + 2] = color.b * brightness;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const material = new THREE.PointsMaterial({
        size: innerWidth < 700 ? 0.13 : 0.105,
        map: texture,
        vertexColors: true,
        transparent: true,
        opacity: 0.96,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      galaxy.add(new THREE.Points(geometry, material));

      const hazeCanvas = document.createElement("canvas");
      hazeCanvas.width = hazeCanvas.height = 128;
      const hazePaint = hazeCanvas.getContext("2d");
      if (hazePaint) {
        const haze = hazePaint.createRadialGradient(64, 64, 0, 64, 64, 63);
        haze.addColorStop(0, "rgba(255,255,255,.82)");
        haze.addColorStop(0.25, "rgba(255,255,255,.3)");
        haze.addColorStop(1, "rgba(255,255,255,0)");
        hazePaint.fillStyle = haze;
        hazePaint.fillRect(0, 0, 128, 128);
      }
      const hazeTexture = new THREE.CanvasTexture(hazeCanvas);
      const hazeMaterials: InstanceType<typeof THREE.SpriteMaterial>[] = [];
      const addHaze = (x: number, y: number, z: number, scale: number, tint: number, opacity: number) => {
        const hazeMaterial = new THREE.SpriteMaterial({
          map: hazeTexture, color: tint, transparent: true, opacity,
          blending: THREE.AdditiveBlending, depthWrite: false,
        });
        hazeMaterials.push(hazeMaterial);
        const cloud = new THREE.Sprite(hazeMaterial);
        cloud.position.set(x, y, z);
        cloud.scale.set(scale, scale * 0.7, 1);
        galaxy.add(cloud);
      };
      addHaze(0, 0, -0.15, 3.8, 0xd1aa9d, 0.2);
      for (let arm = 0; arm < 4; arm++) {
        for (const radius of [1.35, 2.5, 3.65]) {
          const angle = arm * Math.PI / 2 + radius * 1.44;
          addHaze(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.69,
            -0.3, 1.45 + radius * 0.29, arm % 2 ? 0x9ea9c2 : 0xc99e91, 0.09);
        }
      }

      // Sparse foreground stars give the orbit actual parallax as the page moves.
      const distant = new Float32Array(270 * 3);
      for (let i = 0; i < distant.length; i += 3) {
        distant[i] = (Math.random() - 0.5) * 27;
        distant[i + 1] = (Math.random() - 0.5) * 19;
        distant[i + 2] = -3 - Math.random() * 5;
      }
      const distantGeometry = new THREE.BufferGeometry();
      distantGeometry.setAttribute("position", new THREE.BufferAttribute(distant, 3));
      const distantMaterial = new THREE.PointsMaterial({
        size: 0.075, map: texture, color: 0xd8dce8, transparent: true,
        opacity: 0.56, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const distantPoints = new THREE.Points(distantGeometry, distantMaterial);
      scene.add(distantPoints);

      const foreground = new Float32Array(115 * 3);
      for (let i = 0; i < foreground.length; i += 3) {
        foreground[i] = (Math.random() - 0.5) * 17;
        foreground[i + 1] = (Math.random() - 0.5) * 13;
        foreground[i + 2] = 2 + Math.random() * 3;
      }
      const foregroundGeometry = new THREE.BufferGeometry();
      foregroundGeometry.setAttribute("position", new THREE.BufferAttribute(foreground, 3));
      const foregroundMaterial = new THREE.PointsMaterial({
        size: 0.058, map: texture, color: 0xe0d7dc, transparent: true,
        opacity: 0.46, blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const foregroundPoints = new THREE.Points(foregroundGeometry, foregroundMaterial);
      scene.add(foregroundPoints);

      let pointerX = 0, pointerY = 0, scroll = 0, scrollImpulse = 0;
      let lastScrollY = scrollY, frame = 0, lastFrame = 0, running = false;
      const onPointer = (event: globalThis.PointerEvent) => {
        pointerX = (event.clientX / innerWidth - 0.5) * 2;
        pointerY = (event.clientY / innerHeight - 0.5) * 2;
      };
      const onScroll = () => {
        scrollImpulse = Math.min(0.5, scrollImpulse + Math.abs(scrollY - lastScrollY) / 700);
        lastScrollY = scrollY;
        scroll = Math.min(1, scrollY / Math.max(innerHeight, document.documentElement.scrollHeight - innerHeight));
      };
      const resize = () => {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        const mobile = width < 700;
        galaxy.scale.setScalar(mobile ? 0.77 : 1.27);
        galaxy.position.set(mobile ? 0 : 3.0, mobile ? -2.48 : -0.27, 0);
        material.size = mobile ? 0.13 : 0.105;
        material.opacity = mobile ? 0.84 : 0.96;
      };
      const render = (now: number) => {
        if (!running || document.hidden) return;
        if (now - lastFrame > 25 || reducedMotion.matches) {
          const time = reducedMotion.matches ? 0 : now * 0.00007;
          galaxy.rotation.z += ((time + scroll * 0.95 + pointerX * 0.06) - galaxy.rotation.z) * 0.025;
          galaxy.rotation.x += ((-0.31 + scroll * 0.55 + pointerY * 0.2) - galaxy.rotation.x) * 0.035;
          galaxy.rotation.y += ((0.26 + pointerX * 0.37 + scroll * 0.39) - galaxy.rotation.y) * 0.035;
          const mobile = innerWidth < 700;
          const travel = Math.min(1, scroll * 4);
          scrollImpulse *= 0.92;
          galaxy.position.x += ((mobile ? pointerX * 0.3 : 3.0 - travel * 6.0 + pointerX * 0.52) - galaxy.position.x) * 0.035;
          galaxy.position.y += (((mobile ? -2.48 : -0.27) + scroll * (mobile ? 2.6 : 1.45) - pointerY * 0.3) - galaxy.position.y) * 0.035;
          galaxy.scale.setScalar((mobile ? 0.77 : 1.27) * (1 + travel * 0.09 + scrollImpulse * 0.16));
          camera.position.z += ((12 - scrollImpulse * 0.5) - camera.position.z) * 0.08;
          foregroundMaterial.opacity = 0.46 + scrollImpulse * 0.35;
          distantPoints.position.x += ((pointerX * 0.12 + scroll * 0.4) - distantPoints.position.x) * 0.025;
          distantPoints.position.y += ((-pointerY * 0.1 - scroll * 0.3) - distantPoints.position.y) * 0.025;
          foregroundPoints.position.x += ((-pointerX * 0.62 - scroll * 0.75) - foregroundPoints.position.x) * 0.05;
          foregroundPoints.position.y += ((pointerY * 0.46 + scroll * 0.8) - foregroundPoints.position.y) * 0.05;
          renderer.domElement.style.opacity = String(1 - travel * (mobile ? 0.36 : 0.25));
          distantPoints.rotation.z = -galaxy.rotation.z * 0.13;
          renderer.render(scene, camera);
          lastFrame = now;
        }
        if (!reducedMotion.matches) frame = requestAnimationFrame(render);
        else running = false;
      };
      const start = () => {
        cancelAnimationFrame(frame);
        running = true;
        frame = requestAnimationFrame(render);
      };
      const onVisibility = () => {
        if (document.hidden) { running = false; cancelAnimationFrame(frame); }
        else start();
      };
      addEventListener("pointermove", onPointer, { passive: true });
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", resize);
      document.addEventListener("visibilitychange", onVisibility);
      reducedMotion.addEventListener("change", start);
      resize(); onScroll(); start();
      cleanUp = () => {
        running = false;
        cancelAnimationFrame(frame);
        removeEventListener("pointermove", onPointer);
        removeEventListener("scroll", onScroll);
        removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        reducedMotion.removeEventListener("change", start);
        geometry.dispose(); distantGeometry.dispose(); foregroundGeometry.dispose();
        material.dispose(); distantMaterial.dispose(); foregroundMaterial.dispose();
        texture.dispose(); hazeTexture.dispose(); hazeMaterials.forEach(item => item.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});

    return () => { cancelled = true; cleanUp(); };
  }, []);

  return <div className="galaxy-environment" ref={mount} aria-hidden="true" />;
}
