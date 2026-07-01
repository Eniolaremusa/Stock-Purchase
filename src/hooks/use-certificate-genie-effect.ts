"use client";

import { useCallback, useRef } from "react";
import * as THREE from "three";
import html2canvas from "html2canvas";

import { MOTION_PRESETS } from "@/lib/success-motion-config";

/** Bottom edge width as a fraction of top width at full deformation (0.55–0.65). */
export const BOTTOM_WIDTH_RATIO = 0.6;

/** Inward side-curve depth as a fraction of card half-width (keep small, ~3–5%). */
export const CONCAVE_DEPTH = 0.04;

const COLS = 20;
const ROWS = 30;
const { springStiffness: SPRING_STIFFNESS, springDamping: SPRING_DAMPING } =
  MOTION_PRESETS.expressive.tilt;
const COMPLETION_THRESHOLD = 0.01;
const MIN_MESH_SCALE = 0.065;
const MIN_ANIMATION_MS = 1200;
const CANVAS_Z_INDEX = 15;
const FIXED_DT = 1 / 60;
const MAX_PHYSICS_STEPS = 4;
/** Matches fade-on-contact threshold — bottom reaches the button. */
export const GENIE_CONTACT_PROGRESS = 0.9;

export interface CertificateGenieOptions {
  layerContainer?: HTMLElement | null;
  /** Fires once when the certificate bottom reaches the button (~90% descent). */
  onContact?: () => void;
}

interface GenieRuntime {
  renderer: THREE.WebGLRenderer | null;
  scene: THREE.Scene | null;
  camera: THREE.OrthographicCamera | null;
  mesh: THREE.Mesh | null;
  geometry: THREE.PlaneGeometry | null;
  basePositions: Float32Array | null;
  canvas: HTMLCanvasElement | null;
  rafId: number | null;
}

interface SpringState {
  value: number;
  velocity: number;
}

interface VertexPrecompute {
  baseX: Float32Array;
  baseY: Float32Array;
  baseZ: Float32Array;
  taperCurve: Float32Array;
  normalizedX: Float32Array;
  concaveCurve: Float32Array;
  yShiftPow: Float32Array;
}

function domYToThreeY(domY: number, viewportHeight: number) {
  return viewportHeight - domY;
}

function createRuntime(): GenieRuntime {
  return {
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    geometry: null,
    basePositions: null,
    canvas: null,
    rafId: null,
  };
}

function buildVertexPrecompute(
  basePositions: Float32Array,
  halfWidth: number,
  halfHeight: number
): VertexPrecompute {
  const count = basePositions.length / 3;
  const baseX = new Float32Array(count);
  const baseY = new Float32Array(count);
  const baseZ = new Float32Array(count);
  const taperCurve = new Float32Array(count);
  const normalizedX = new Float32Array(count);
  const concaveCurve = new Float32Array(count);
  const yShiftPow = new Float32Array(count);
  const invHeight2 = 1 / (halfHeight * 2);

  for (let i = 0; i < count; i++) {
    const bx = basePositions[i * 3];
    const by = basePositions[i * 3 + 1];
    const bz = basePositions[i * 3 + 2];
    const ny = (halfHeight - by) * invHeight2;

    baseX[i] = bx;
    baseY[i] = by;
    baseZ[i] = bz;
    taperCurve[i] = ny ** 1.35;
    normalizedX[i] = bx / halfWidth;
    concaveCurve[i] = Math.sin(ny * Math.PI);
    yShiftPow[i] = ny ** 1.15;
  }

  return {
    baseX,
    baseY,
    baseZ,
    taperCurve,
    normalizedX,
    concaveCurve,
    yShiftPow,
  };
}

/** Most shrink happens in the back half of the descent. */
function computeMeshScale(progress: number) {
  const p = Math.min(1, Math.max(0, progress));
  if (p <= 0.5) {
    const early = p / 0.5;
    return 1 - early * 0.12 * (1 - MIN_MESH_SCALE);
  }
  const late = (p - 0.5) / 0.5;
  const lateShrink = 0.12 + late ** 1.35 * 0.88;
  return 1 - lateShrink * (1 - MIN_MESH_SCALE);
}

/** Opacity stays full until the bottom nears the button, then dissolves on contact. */
function computeOpacityFromContact(contactT: number) {
  const t = Math.min(1, Math.max(0, contactT));
  const fadeStart = 0.9;
  if (t <= fadeStart) return 1;
  const fade = (t - fadeStart) / (1 - fadeStart);
  return 1 - fade ** 1.35;
}

function deformGeometryInPlace(
  posArray: Float32Array,
  precompute: VertexPrecompute,
  progress: number,
  halfWidth: number,
  xShiftTarget: number
) {
  const p = Math.min(1, Math.max(0, progress));
  const count = precompute.baseX.length;
  const widthTaper = 1 - BOTTOM_WIDTH_RATIO;
  const concaveScale = CONCAVE_DEPTH * halfWidth * p;

  for (let i = 0; i < count; i++) {
    const rowHalfWidth = halfWidth * (1 - widthTaper * p * precompute.taperCurve[i]);
    let newX = precompute.normalizedX[i] * rowHalfWidth;

    const inward = concaveScale * precompute.concaveCurve[i];
    const bx = precompute.baseX[i];
    if (bx < 0) {
      newX += inward;
    } else if (bx > 0) {
      newX -= inward;
    }

    newX += xShiftTarget * p * precompute.yShiftPow[i];

    const o = i * 3;
    posArray[o] = newX;
    posArray[o + 1] = precompute.baseY[i];
    posArray[o + 2] = precompute.baseZ[i];
  }
}

function integrateSpring(
  state: SpringState,
  target: number,
  stiffness: number,
  damping: number,
  dt: number
) {
  const acceleration = stiffness * (target - state.value) - damping * state.velocity;
  state.velocity += acceleration * dt;
  state.value += state.velocity * dt;
}

function applyFrameState(
  mesh: THREE.Mesh,
  material: THREE.MeshBasicMaterial,
  posArray: Float32Array,
  positionAttr: THREE.BufferAttribute,
  precompute: VertexPrecompute,
  progress: number,
  startX: number,
  startBottomY: number,
  buttonTopThreeY: number,
  height: number,
  halfWidth: number,
  xShiftTarget: number
) {
  const p = Math.min(1, Math.max(0, progress));
  const meshScale = computeMeshScale(p);
  const scaledHalfHeight = (height * meshScale) * 0.5;
  const meshBottomY = startBottomY + (buttonTopThreeY - startBottomY) * p;
  const posY = meshBottomY + scaledHalfHeight;

  deformGeometryInPlace(posArray, precompute, p, halfWidth, xShiftTarget);
  positionAttr.needsUpdate = true;

  material.opacity = computeOpacityFromContact(p);

  mesh.position.x = startX;
  mesh.position.y = posY;
  mesh.position.z = 0;
  mesh.scale.x = meshScale;
  mesh.scale.y = meshScale;
  mesh.scale.z = 1;
}

function disposeRuntime(runtime: GenieRuntime) {
  if (runtime.rafId !== null) {
    cancelAnimationFrame(runtime.rafId);
    runtime.rafId = null;
  }

  runtime.geometry?.dispose();
  const material = runtime.mesh?.material;
  if (material instanceof THREE.Material) {
    const map = (material as THREE.MeshBasicMaterial).map;
    map?.dispose();
    material.dispose();
  }

  runtime.renderer?.dispose();

  if (runtime.canvas?.parentNode) {
    runtime.canvas.parentNode.removeChild(runtime.canvas);
  }

  Object.assign(runtime, createRuntime());
}

export function useCertificateGenieEffect() {
  const runtimeRef = useRef<GenieRuntime>(createRuntime());

  const play = useCallback(
    (
      certificateElement: HTMLElement,
      buttonElement: HTMLElement,
      options?: CertificateGenieOptions
    ) =>
      new Promise<void>((resolve) => {
        if (typeof window === "undefined") {
          resolve();
          return;
        }

        const runtime = runtimeRef.current;
        disposeRuntime(runtime);

        const certRect = certificateElement.getBoundingClientRect();
        const btnRect = buttonElement.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const certCenterDomY = certRect.top + certRect.height / 2;
        const certCenterX = certRect.left + certRect.width / 2;
        const buttonCenterX = btnRect.left + btnRect.width / 2;
        const buttonTopThreeY = domYToThreeY(btnRect.top, viewportHeight);

        const startY = domYToThreeY(certCenterDomY, viewportHeight);
        const startX = certCenterX;

        void html2canvas(certificateElement, {
          backgroundColor: null,
          scale: Math.min(2, window.devicePixelRatio || 1),
          useCORS: true,
          logging: false,
        }).then((captureCanvas) => {
          certificateElement.style.opacity = "0";

          const texture = new THREE.CanvasTexture(captureCanvas);
          texture.colorSpace = THREE.SRGBColorSpace;

          const width = certRect.width;
          const height = certRect.height;
          const halfWidth = width / 2;
          const halfHeight = height / 2;
          const startBottomY = startY - height / 2;
          const xShiftTarget = buttonCenterX - certCenterX;

          const geometry = new THREE.PlaneGeometry(width, height, COLS, ROWS);
          const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
          const posArray = positionAttr.array as Float32Array;
          const basePositions = new Float32Array(posArray);
          const precompute = buildVertexPrecompute(basePositions, halfWidth, halfHeight);

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.FrontSide,
            depthWrite: false,
          });

          const mesh = new THREE.Mesh(geometry, material);

          const scene = new THREE.Scene();
          scene.add(mesh);

          const camera = new THREE.OrthographicCamera(
            0,
            window.innerWidth,
            viewportHeight,
            0,
            -1000,
            1000
          );

          const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
          });
          renderer.setPixelRatio(window.devicePixelRatio || 1);
          renderer.setSize(window.innerWidth, viewportHeight);
          renderer.setClearColor(0x000000, 0);

          const canvas = renderer.domElement;
          canvas.style.position = "fixed";
          canvas.style.top = "0";
          canvas.style.left = "0";
          canvas.style.width = "100vw";
          canvas.style.height = "100vh";
          canvas.style.pointerEvents = "none";
          canvas.style.zIndex = String(CANVAS_Z_INDEX);
          const layerParent = options?.layerContainer ?? document.body;
          layerParent.appendChild(canvas);

          runtime.renderer = renderer;
          runtime.scene = scene;
          runtime.camera = camera;
          runtime.mesh = mesh;
          runtime.geometry = geometry;
          runtime.basePositions = basePositions;
          runtime.canvas = canvas;

          const progressSpring: SpringState = { value: 0, velocity: 0 };
          let lastTime = performance.now();
          let accumulator = 0;
          let contactFired = false;
          const animationStart = lastTime;

          const maybeFireContact = (progress: number) => {
            if (contactFired || progress < GENIE_CONTACT_PROGRESS) return;
            contactFired = true;
            options?.onContact?.();
          };

          const tick = (now: number) => {
            const frameTime = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            accumulator += frameTime;

            let steps = 0;
            while (accumulator >= FIXED_DT && steps < MAX_PHYSICS_STEPS) {
              integrateSpring(
                progressSpring,
                1,
                SPRING_STIFFNESS,
                SPRING_DAMPING,
                FIXED_DT
              );
              accumulator -= FIXED_DT;
              steps += 1;
            }
            if (steps === MAX_PHYSICS_STEPS) {
              accumulator = 0;
            }

            const elapsed = now - animationStart;
            const progress = Math.min(1, progressSpring.value);
            maybeFireContact(progress);

            applyFrameState(
              mesh,
              material,
              posArray,
              positionAttr,
              precompute,
              progress,
              startX,
              startBottomY,
              buttonTopThreeY,
              height,
              halfWidth,
              xShiftTarget
            );

            renderer.render(scene, camera);

            const progressSettled =
              Math.abs(1 - progressSpring.value) < COMPLETION_THRESHOLD &&
              Math.abs(progressSpring.velocity) < COMPLETION_THRESHOLD;
            const durationMet = elapsed >= MIN_ANIMATION_MS;

            if (!progressSettled || !durationMet) {
              runtime.rafId = requestAnimationFrame(tick);
              return;
            }

            applyFrameState(
              mesh,
              material,
              posArray,
              positionAttr,
              precompute,
              1,
              startX,
              startBottomY,
              buttonTopThreeY,
              height,
              halfWidth,
              xShiftTarget
            );
            maybeFireContact(1);
            renderer.render(scene, camera);

            disposeRuntime(runtime);
            resolve();
          };

          applyFrameState(
            mesh,
            material,
            posArray,
            positionAttr,
            precompute,
            0,
            startX,
            startBottomY,
            buttonTopThreeY,
            height,
            halfWidth,
            xShiftTarget
          );
          renderer.render(scene, camera);
          runtime.rafId = requestAnimationFrame(tick);
        });
      }),
    []
  );

  const cancel = useCallback(() => {
    disposeRuntime(runtimeRef.current);
  }, []);

  return { play, cancel };
}
