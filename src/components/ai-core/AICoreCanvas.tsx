"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTheme } from "next-themes";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import * as THREE from "three";
import { AICoreFallback } from "./AICoreFallback";
import styles from "./AICore.module.css";

const vertexShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    float waveA = sin(position.y * 5.2 + uTime * 0.42);
    float waveB = sin((position.x + position.z) * 4.1 - uTime * 0.31);
    vec3 displaced = position + normal * (waveA + waveB) * 0.018;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uSignature;
  uniform vec3 uBase;
  uniform vec3 uLight;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.7);
    float flow = 0.5 + 0.5 * sin(vPosition.y * 8.0 + vPosition.x * 5.0 + uTime * 0.36);
    float densityA = 0.5 + 0.5 * sin(vPosition.x * 11.0 - vPosition.z * 6.0 + uTime * 0.17);
    float densityB = 0.5 + 0.5 * sin(vPosition.y * 9.0 + vPosition.z * 7.0 - uTime * 0.23 + 1.7);
    float density = mix(densityA, densityB, 0.44);
    float frontLight = smoothstep(-0.35, 0.78, normal.z);
    vec3 cyan = vec3(0.57, 0.91, 0.94);
    vec3 violet = vec3(0.76, 0.68, 0.98);
    vec3 spectral = mix(cyan, violet, smoothstep(-0.5, 0.6, normal.x));
    vec3 color = mix(uBase, uLight, flow * 0.11 + density * 0.12 + uSignature * 0.12);
    color = mix(color, spectral, fresnel * 0.075);
    color *= mix(0.68, 1.0, frontLight);
    float alpha = 0.22 + density * 0.11 + flow * 0.055 + fresnel * 0.32 + uSignature * 0.09;
    gl_FragColor = vec4(color, alpha);
  }
`;

type ViewState = {
  inView: boolean;
  ratio: number;
};

type OrbitDefinition = {
  curve: THREE.CatmullRomCurve3;
  rotation: [number, number, number];
  phase: number;
  speed: number;
  opacity: number;
  thickness: number;
  nodeScale: number;
  warm: boolean;
};

function useMediaQuery(query: string) {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", notify);
    return () => media.removeEventListener("change", notify);
  }, [query]);

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
}

function createOrbitCurve(
  radiusX: number,
  radiusY: number,
  depth: number,
  phase: number,
  pointCount: number,
) {
  const points = Array.from({ length: pointCount }, (_, index) => {
    const angle = (index / pointCount) * Math.PI * 2;
    return new THREE.Vector3(
      Math.cos(angle) * radiusX,
      Math.sin(angle) * radiusY,
      Math.sin(angle * 2 + phase) * depth,
    );
  });

  return new THREE.CatmullRomCurve3(points, true, "centripetal");
}

function ContextLifecycle({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const onContextLost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };

    canvas.addEventListener("webglcontextlost", onContextLost);
    return () => canvas.removeEventListener("webglcontextlost", onContextLost);
  }, [gl, onFailure]);

  return null;
}

function CoreScene({
  compact,
  staticFrame,
  energy,
}: {
  compact: boolean;
  staticFrame: boolean;
  energy: number;
}) {
  const root = useRef<THREE.Group>(null);
  const innerCore = useRef<THREE.Mesh>(null);
  const middleLayer = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const wireframe = useRef<THREE.Mesh>(null);
  const keyLight = useRef<THREE.PointLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const glowMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const shellMaterial = useRef<THREE.MeshPhysicalMaterial>(null);
  const orbitGroups = useRef<Array<THREE.Group | null>>([]);
  const orbitNodes = useRef<Array<THREE.Mesh | null>>([]);
  const orbitNodeMaterials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const orbitHaloMaterials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const dataLights = useRef<Array<THREE.Mesh | null>>([]);
  const { theme } = useTheme();
  const dark = theme !== "light";

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSignature: { value: 0 },
    uBase: { value: new THREE.Color(dark ? "#c1cdd1" : "#536067") },
    uLight: { value: new THREE.Color(dark ? "#f5f8f9" : "#ffffff") },
  }), [dark]);

  const orbits = useMemo<OrbitDefinition[]>(() => {
    const pointCount = compact ? 36 : 52;
    const definitions: OrbitDefinition[] = [
      {
        curve: createOrbitCurve(1.82, 0.76, 0.38, 0.2, pointCount),
        rotation: [0.5, 0.16, -0.22],
        phase: 0.08,
        speed: compact ? 0.015 : 0.02,
        opacity: 0.32,
        thickness: compact ? 0.0052 : 0.0074,
        nodeScale: 0.021,
        warm: false,
      },
      {
        curve: createOrbitCurve(1.66, 0.64, 0.33, 1.7, pointCount),
        rotation: [-0.32, 1.03, 0.48],
        phase: 0.46,
        speed: compact ? -0.011 : -0.015,
        opacity: 0.17,
        thickness: compact ? 0.0035 : 0.0048,
        nodeScale: 0.015,
        warm: false,
      },
      {
        curve: createOrbitCurve(1.54, 0.53, 0.27, 3.2, pointCount),
        rotation: [1.12, -0.42, 0.72],
        phase: 0.74,
        speed: 0.01,
        opacity: 0.085,
        thickness: 0.0028,
        nodeScale: 0.012,
        warm: true,
      },
    ];
    return definitions.slice(0, compact ? 2 : 3);
  }, [compact]);

  useFrame((state, frameDelta) => {
    if (
      !root.current
      || !innerCore.current
      || !middleLayer.current
      || !glow.current
      || !shell.current
      || !wireframe.current
      || !material.current
      || staticFrame
    ) {
      return;
    }

    const delta = Math.min(frameDelta, 0.05);
    const elapsed = state.clock.elapsedTime;
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    const motionEnergy = Math.max(0.28, energy);
    const signatureWave = Math.sin(
      elapsed * 0.62 - 1.2 + Math.sin(elapsed * 0.17 + 0.4) * 0.55,
    );
    const signature = THREE.MathUtils.smoothstep(signatureWave, 0.72, 1);

    material.current.uniforms.uTime.value += delta * motionEnergy;
    material.current.uniforms.uSignature.value = THREE.MathUtils.damp(
      material.current.uniforms.uSignature.value,
      signature,
      2.1,
      delta,
    );

    root.current.position.x = THREE.MathUtils.damp(
      root.current.position.x,
      pointerX * 0.07,
      2.2,
      delta,
    );
    root.current.position.y = THREE.MathUtils.damp(
      root.current.position.y,
      pointerY * 0.052,
      2.2,
      delta,
    );
    root.current.rotation.x = THREE.MathUtils.damp(
      root.current.rotation.x,
      pointerY * -0.035,
      2.6,
      delta,
    );
    root.current.rotation.y = THREE.MathUtils.damp(
      root.current.rotation.y,
      pointerX * 0.045,
      2.6,
      delta,
    );

    const breathing = 1 + Math.sin(elapsed * 0.43) * 0.008 * motionEnergy;
    innerCore.current.scale.setScalar(breathing * (1 + signature * 0.024));
    innerCore.current.rotation.x = elapsed * -0.01 * motionEnergy + pointerY * -0.036;
    innerCore.current.rotation.y = elapsed * 0.026 * motionEnergy + pointerX * 0.058;

    middleLayer.current.rotation.x = elapsed * 0.006 * motionEnergy + pointerY * -0.052;
    middleLayer.current.rotation.y = elapsed * -0.011 * motionEnergy + pointerX * 0.078;
    middleLayer.current.rotation.z = elapsed * 0.004 * motionEnergy;

    const glowPulse = 1 + Math.sin(elapsed * 0.31 + 1.4) * 0.014 * motionEnergy;
    glow.current.scale.setScalar(0.72 * glowPulse * (1 + signature * 0.045));
    glow.current.rotation.z = elapsed * -0.015 * motionEnergy;
    if (glowMaterial.current) {
      glowMaterial.current.opacity = (dark ? 0.2 : 0.11) + signature * 0.055;
    }

    shell.current.rotation.x = elapsed * 0.006 * motionEnergy + pointerY * -0.066;
    shell.current.rotation.y = elapsed * 0.012 * motionEnergy + pointerX * 0.106;
    wireframe.current.rotation.x = elapsed * -0.011 * motionEnergy + pointerY * -0.112;
    wireframe.current.rotation.y = elapsed * -0.019 * motionEnergy + pointerX * 0.138;
    wireframe.current.rotation.z = elapsed * 0.005 * motionEnergy;
    if (shellMaterial.current) {
      shellMaterial.current.opacity = (dark ? 0.075 : 0.105) + signature * 0.018;
      shellMaterial.current.emissiveIntensity = signature * 0.12;
    }

    orbits.forEach((orbit, index) => {
      const orbitGroup = orbitGroups.current[index];
      const node = orbitNodes.current[index];
      if (orbitGroup) {
        orbitGroup.rotation.x = THREE.MathUtils.damp(
          orbitGroup.rotation.x,
          orbit.rotation[0]
          + Math.sin(elapsed * (0.037 + index * 0.009)) * 0.025 * motionEnergy
          + pointerY * (-0.052 - index * 0.012),
          1.8 + index * 0.2,
          delta,
        );
        orbitGroup.rotation.y = THREE.MathUtils.damp(
          orbitGroup.rotation.y,
          orbit.rotation[1]
          + elapsed * (0.009 + index * 0.004) * (index % 2 === 0 ? 1 : -1) * motionEnergy
          + pointerX * (0.068 + index * 0.012),
          1.8 + index * 0.2,
          delta,
        );
        orbitGroup.rotation.z = orbit.rotation[2]
          + elapsed * (0.005 + index * 0.003) * motionEnergy;
      }
      if (node) {
        const progress = THREE.MathUtils.euclideanModulo(
          orbit.phase + elapsed * orbit.speed * motionEnergy,
          1,
        );
        node.position.copy(orbit.curve.getPointAt(progress));
        const frontness = THREE.MathUtils.clamp((node.position.z + 0.5) / 1.05, 0, 1);
        const nodePulse = 1 + Math.sin(elapsed * (0.67 + index * 0.11) + index) * 0.055;
        const depthScale = 0.9 + frontness * 0.14;
        node.scale.setScalar(orbit.nodeScale * nodePulse * depthScale);
        if (orbitNodeMaterials.current[index]) {
          orbitNodeMaterials.current[index].opacity = (index === 0 ? 0.5 : 0.36)
            * (0.42 + frontness * 0.58);
        }
        if (orbitHaloMaterials.current[index]) {
          orbitHaloMaterials.current[index].opacity = (index === 0 ? 0.07 : 0.045)
            * (0.35 + frontness * 0.65);
        }
      }
    });

    dataLights.current.forEach((light, index) => {
      if (!light) return;
      const phase = elapsed * (0.13 + index * 0.027) + index * 2.1;
      light.position.set(
        Math.sin(phase * 1.13) * (0.32 + index * 0.05),
        Math.cos(phase * 0.91 + index) * (0.28 + index * 0.035),
        Math.sin(phase * 0.73 + 1.4) * 0.24,
      );
      light.scale.setScalar(0.012 + signature * 0.004 + Math.sin(phase * 1.7) * 0.0015);
    });

    if (keyLight.current) {
      keyLight.current.position.set(
        2.55 + Math.sin(elapsed * 0.17) * 0.34 + pointerX * 0.34,
        3.25 + Math.cos(elapsed * 0.13) * 0.22 - pointerY * 0.2,
        3.9,
      );
      keyLight.current.intensity = (dark ? 16 : 9) + signature * (dark ? 2.4 : 1.2);
    }
    if (fillLight.current) {
      fillLight.current.position.set(
        -2.8 + Math.cos(elapsed * 0.11) * 0.28,
        -1.3 + Math.sin(elapsed * 0.15) * 0.24,
        2.2,
      );
    }
  });

  const segments = compact ? 32 : 56;
  const detail = compact ? 3 : 5;

  return (
    <group ref={root}>
      <ambientLight intensity={dark ? 0.4 : 0.68} />
      <pointLight
        ref={keyLight}
        position={[2.6, 3.4, 4]}
        intensity={dark ? 16 : 9}
        color="#f6fbff"
      />
      <pointLight
        ref={fillLight}
        position={[-3, -1.4, 2]}
        intensity={dark ? 7 : 4}
        color="#b8d9e0"
      />

      <mesh ref={middleLayer} scale={1.04} renderOrder={0}>
        <sphereGeometry args={[1, compact ? 28 : 48, compact ? 20 : 34]} />
        <meshPhysicalMaterial
          color={dark ? "#2f383d" : "#768188"}
          transparent
          opacity={dark ? 0.18 : 0.14}
          roughness={0.48}
          metalness={0.08}
          clearcoat={0.35}
          clearcoatRoughness={0.32}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={innerCore} renderOrder={1}>
        <icosahedronGeometry args={[0.83, detail]} />
        <shaderMaterial
          ref={material}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={glow} scale={0.72} renderOrder={1}>
        <sphereGeometry args={[1, compact ? 24 : 40, compact ? 18 : 30]} />
        <meshBasicMaterial
          ref={glowMaterial}
          color={dark ? "#c8d8dd" : "#66737a"}
          transparent
          opacity={dark ? 0.2 : 0.11}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {[
        [-0.22, 0.18, 0.2],
        [0.26, -0.12, 0.08],
        [0.04, 0.29, -0.14],
      ].slice(0, compact ? 2 : 3).map((position, index) => (
        <mesh
          key={`data-light-${index}`}
          ref={(node) => {
            dataLights.current[index] = node;
          }}
          position={position as [number, number, number]}
          scale={0.012}
          renderOrder={1}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color={index === 2 ? "#e8d9bc" : "#eaf8fa"}
            transparent
            opacity={index === 2 ? 0.18 : 0.24}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      <mesh renderOrder={2}>
        <sphereGeometry args={[1.15, segments, Math.round(segments * 0.72)]} />
        <meshBasicMaterial colorWrite={false} depthWrite depthTest />
      </mesh>

      {orbits.map((orbit, index) => {
        const initialPosition = orbit.curve.getPointAt(orbit.phase);
        return (
          <group
            key={index}
            ref={(node) => {
              orbitGroups.current[index] = node;
            }}
            rotation={orbit.rotation}
            renderOrder={3}
          >
            <mesh>
              <tubeGeometry
                args={[
                  orbit.curve,
                  compact ? 56 : 88,
                  orbit.thickness,
                  5,
                  true,
                ]}
              />
              <meshStandardMaterial
                color={dark ? "#dce7ea" : "#59636a"}
                emissive={dark ? "#89979c" : "#ffffff"}
                emissiveIntensity={index === 0 ? 0.12 : 0.035}
                roughness={index === 0 ? 0.32 : 0.46}
                metalness={index === 0 ? 0.22 : 0.08}
                transparent
                opacity={orbit.opacity}
                depthTest
                depthWrite={false}
              />
            </mesh>
            <mesh
              ref={(node) => {
                orbitNodes.current[index] = node;
              }}
              position={initialPosition}
              scale={orbit.nodeScale}
            >
              <sphereGeometry args={[1, compact ? 10 : 14, compact ? 10 : 14]} />
              <meshBasicMaterial
                ref={(node) => {
                  orbitNodeMaterials.current[index] = node;
                }}
                color={orbit.warm ? "#f0d39d" : "#e7f7fa"}
                transparent
                opacity={index === 0 ? 0.5 : 0.36}
                depthTest
                depthWrite={false}
              />
              <mesh scale={1.85}>
                <sphereGeometry args={[1, compact ? 8 : 12, compact ? 8 : 12]} />
                <meshBasicMaterial
                  ref={(node) => {
                    orbitHaloMaterials.current[index] = node;
                  }}
                  color={orbit.warm ? "#efd4a6" : "#dff5f8"}
                  transparent
                  opacity={index === 0 ? 0.07 : 0.045}
                  depthTest
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </mesh>
          </group>
        );
      })}

      <mesh ref={shell} scale={1.27} renderOrder={4}>
        <sphereGeometry args={[1, segments, Math.round(segments * 0.72)]} />
        <meshPhysicalMaterial
          ref={shellMaterial}
          color={dark ? "#dce7eb" : "#859198"}
          emissive={dark ? "#aab8bd" : "#f2f5f6"}
          emissiveIntensity={0}
          transparent
          opacity={dark ? 0.075 : 0.105}
          roughness={0.08}
          metalness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.045}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={wireframe} scale={1.42} renderOrder={5}>
        <sphereGeometry args={[1, compact ? 24 : 44, compact ? 18 : 32]} />
        <meshPhysicalMaterial
          color={dark ? "#f5fafc" : "#5e6970"}
          wireframe
          transparent
          opacity={dark ? 0.018 : 0.028}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function AICoreCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const compact = useMediaQuery("(max-width: 48rem)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [supported] = useState(supportsWebGL);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(() => document.visibilityState !== "hidden");
  const [viewState, setViewState] = useState<ViewState>({ inView: true, ratio: 1 });

  useEffect(() => {
    const onVisibilityChange = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    if (!target || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setViewState({
          inView: entry.isIntersecting,
          ratio: entry.intersectionRatio,
        });
      },
      { threshold: [0, 0.05, 0.2, 0.4, 0.65, 0.85, 1] },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const onFailure = useCallback(() => setFailed(true), []);

  if (!supported || failed) {
    return <AICoreFallback />;
  }

  const active = visible && viewState.inView && viewState.ratio > 0.02 && !reducedMotion;
  const energy = Math.max(0.24, Math.min(1, viewState.ratio));
  const canvasOpacity = 0.68 + energy * 0.32;

  return (
    <div
      ref={containerRef}
      className={styles.canvas}
      data-ai-core-active={active}
      data-ai-core-motion={reducedMotion ? "static" : "layered"}
      data-ai-core-visibility={viewState.ratio.toFixed(2)}
      style={{ opacity: canvasOpacity }}
    >
      <Canvas
        dpr={compact ? [1, 1.2] : [1, 1.5]}
        camera={{ position: [0, 0, compact ? 5 : 5.3], fov: compact ? 42 : 38 }}
        frameloop={active ? "always" : "demand"}
        gl={{
          alpha: true,
          antialias: !compact,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        }}
        performance={{ min: 0.55 }}
      >
        <ContextLifecycle onFailure={onFailure} />
        <CoreScene compact={compact} staticFrame={!active} energy={energy} />
      </Canvas>
    </div>
  );
}
