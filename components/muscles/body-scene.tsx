"use client";

/* eslint-disable react-hooks/immutability --
   three.js est impératif : on mute directement les matériaux (couleur / émissif)
   des maillages hors du flux React. La règle d'immutabilité du React Compiler ne
   s'applique pas à ce cas (objets three.js, pas un état React). */

// Écorché anatomique (public/muscles.glb — modèle fait main, muscles nommés +
// squelette, compressé en Draco). Chaque maillage est rangé dans l'un des 18
// groupes du site via `classify()` ; le squelette reste en teinte os. Le survol
// est géré IMPÉRATIVEMENT (mutation directe des matériaux, sans état React) pour
// ne pas re-rendre toute la scène à chaque pixel — seule la sélection (clic)
// passe par React.

import { Canvas, useThree, type ThreeEvent } from "@react-three/fiber";
import { Bounds, Html, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { GROUP_COLORS } from "@/lib/muscles/groups";
import { classify } from "@/lib/muscles/classify";

const MODEL_URL = "/muscles.glb";
// Modèle compressé en Draco → décodeur servi en local (autonome / hors-ligne).
const DRACO_PATH = "/draco/gltf/";
useGLTF.preload(MODEL_URL, DRACO_PATH);

const BONE = new THREE.Color("#e6dfd0");
const BLACK = new THREE.Color("#000000");
const WHITE = new THREE.Color("#ffffff");

export type Look = "realistic" | "atlas" | "clair";

/** Couleur de repos d'un maillage selon le style choisi. */
function baseColor(group: string | null, look: Look, dim: boolean): THREE.Color {
  if (look === "atlas") {
    if (group) return new THREE.Color(GROUP_COLORS[group]).lerp(WHITE, dim ? 0.55 : 0.12);
    return new THREE.Color(dim ? "#a9a39d" : "#cbc5bf");
  }
  if (look === "clair") {
    return new THREE.Color(dim ? "#b7b1aa" : "#dcd6cf");
  }
  // realistic
  if (group) return new THREE.Color(dim ? "#7a4440" : "#b0504a");
  return new THREE.Color(dim ? "#6c625e" : "#9d8b86");
}

function AnatomyModel({
  selected,
  look,
  onSelect,
}: {
  selected: string | null;
  look: Look;
  onSelect: (g: string) => void;
}) {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const { invalidate } = useThree();

  // Clone + matériau propre par maillage, une seule fois (scene est stable).
  const { model, meshes } = useMemo(() => {
    const root = scene.clone(true);
    const meshes: THREE.Mesh[] = [];
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const isBone = /squelette|skeleton|\bbone|\bos\b/.test(mesh.name.toLowerCase());
      mesh.userData.bone = isBone;
      mesh.userData.group = isBone ? null : classify(mesh.name);
      mesh.material = new THREE.MeshStandardMaterial({
        roughness: isBone ? 0.85 : 0.72,
        metalness: 0,
      });
      meshes.push(mesh);
    });
    return { model: root, meshes };
  }, [scene]);

  // Groupe actuellement survolé — un ref, PAS un état (aucun re-rendu au survol).
  const hoverRef = useRef<string | null>(null);

  // Applique les couleurs selon sélection + style + survol courant.
  const paint = useCallback(() => {
    const hover = hoverRef.current;
    for (const mesh of meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mesh.userData.bone) {
        mat.color.copy(BONE);
        mat.emissive.copy(BLACK);
        mat.emissiveIntensity = 0;
        continue;
      }
      const group = mesh.userData.group as string | null;
      const isActive = group != null && group === selected;
      const isHover = group != null && group === hover;
      if (isActive || isHover) {
        const accent = new THREE.Color(GROUP_COLORS[group as string]);
        mat.color.copy(accent);
        mat.emissive.copy(accent);
        mat.emissiveIntensity = isActive ? 0.55 : 0.3;
      } else {
        mat.emissive.copy(BLACK);
        mat.emissiveIntensity = 0;
        mat.color.copy(baseColor(group, look, selected != null));
      }
    }
    invalidate();
  }, [meshes, selected, look, invalidate]);

  // Repeint quand la sélection ou le style change (le survol, lui, appelle paint
  // directement dans les gestionnaires ci-dessous).
  useEffect(() => {
    paint();
  }, [paint]);

  function setHover(g: string | null) {
    if (g === hoverRef.current) return;
    hoverRef.current = g;
    document.body.style.cursor = g ? "pointer" : "";
    paint();
  }

  return (
    <primitive
      object={model}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover((e.object.userData?.group as string | null) ?? null);
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHover(null);
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect((e.object.userData?.group as string | null) ?? "");
      }}
    />
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="whitespace-nowrap text-sm text-zinc-500">
        Chargement du modèle 3D… {Math.round(progress)} %
      </div>
    </Html>
  );
}

export function BodyScene({
  selected,
  look,
  onSelect,
}: {
  selected: string | null;
  look: Look;
  onSelect: (g: string) => void;
}): ReactNode {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelect("")}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[3, 5, 4]} intensity={1.35} />
      <directionalLight position={[-4, 1, -3]} intensity={0.5} />

      <Suspense fallback={<Loader />}>
        <Bounds fit clip margin={1.1}>
          <AnatomyModel selected={selected} look={look} onSelect={onSelect} />
        </Bounds>
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={1.5}
        maxDistance={6}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
