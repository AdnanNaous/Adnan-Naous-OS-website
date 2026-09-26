"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/** The fallback image is always present; WebGL adds rooted, height-weighted wind when available. */
export default function HeroTree() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mount.current;
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let dispose = () => {};

    import("three").then((THREE) => {
      if (cancelled) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch { return; }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-4, 4, 4.6, -4.6, .1, 30);
      camera.position.z = 10;
      const geometry = new THREE.PlaneGeometry(6.4, 8.85, 32, 48);
      let texture: InstanceType<typeof THREE.Texture> | null = null;
      let material: InstanceType<typeof THREE.MeshBasicMaterial> | null = null;
      let frame = 0;
      let visible = true;
      let windUniform: { value: number } | null = null;
      let lastFrame = 0;

      const resize = () => {
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        const halfWidth = 4.6 * width / height;
        camera.left = -halfWidth;
        camera.right = halfWidth;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      const render = (time: number) => {
        if (!visible || document.hidden) return;
        if (time - lastFrame > 30) {
          if (windUniform) windUniform.value = time * .001;
          renderer.render(scene, camera);
          lastFrame = time;
        }
        frame = requestAnimationFrame(render);
      };
      const start = () => {
        cancelAnimationFrame(frame);
        if (visible && !document.hidden) frame = requestAnimationFrame(render);
      };
      const onVisibility = () => start();
      const onContextLost = (event: Event) => {
        event.preventDefault();
        host.dataset.ready = "false";
        cancelAnimationFrame(frame);
      };
      const resizeObserver = new ResizeObserver(resize);
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start(); else cancelAnimationFrame(frame);
      }, { threshold: .01 });
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);
      resizeObserver.observe(host);
      intersection.observe(host);
      document.addEventListener("visibilitychange", onVisibility);
      resize();

      const loader = new THREE.TextureLoader();
      loader.load("/art/ivory-tree.webp", loaded => {
        if (cancelled) { loaded.dispose(); return; }
        texture = loaded;
        texture.colorSpace = THREE.SRGBColorSpace;
        material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .015, depthWrite: false, side: THREE.DoubleSide });
        material.onBeforeCompile = shader => {
          shader.uniforms.uWind = { value: 0 };
          windUniform = shader.uniforms.uWind as { value: number };
          shader.vertexShader = shader.vertexShader.replace("#include <common>", "#include <common>\nuniform float uWind;");
          shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>
            float branchWeight = smoothstep(0.22, 0.88, uv.y);
            float crownWeight = smoothstep(0.58, 1.0, uv.y);
            transformed.x += branchWeight * (sin(uWind * 0.37 + uv.y * 4.1) * 0.038 + sin(uWind * 0.17 + uv.x * 5.0) * 0.024);
            transformed.y += crownWeight * sin(uWind * 0.42 + uv.x * 6.2) * 0.018;`);
        };
        const tree = new THREE.Mesh(geometry, material);
        scene.add(tree);
        renderer.render(scene, camera);
        host.dataset.ready = "true";
        start();
      }, undefined, () => { host.dataset.ready = "false"; });

      dispose = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        intersection.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        geometry.dispose();
        material?.dispose();
        texture?.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }).catch(() => {});

    return () => { cancelled = true; dispose(); };
  }, []);

  return <div className="hero-tree" aria-hidden="true">
    <div className="hero-tree-webgl" ref={mount}/>
    <Image className="hero-tree-fallback" src="/art/ivory-tree.webp" alt="" width={1080} height={1440} sizes="(max-width: 700px) 100vw, 60vw" priority/>
  </div>;
}
