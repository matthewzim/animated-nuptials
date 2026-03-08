import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

import parisSrc from "@/assets/photos/paris.jpeg";
import annecySrc from "@/assets/photos/annecy.jpeg";
import beachSrc from "@/assets/photos/beach-sunset.jpeg";
import mountainsSrc from "@/assets/photos/mountains.jpeg";
import netherlandsSrc from "@/assets/photos/netherlands.jpeg";

import photo1 from "@/assets/photos/1.jpg";
import photo2 from "@/assets/photos/2.jpg";
import photo3 from "@/assets/photos/3.jpg";
import photoIMG1412 from "@/assets/photos/IMG_1412.jpg";
import photoIMG1506 from "@/assets/photos/IMG_1506.jpg";
import photoIMG1554 from "@/assets/photos/IMG_1554.jpg";
import photoIMG1804 from "@/assets/photos/IMG_1804.jpg";
import photoIMG2503 from "@/assets/photos/IMG_2503.jpg";
import photoIMG2528 from "@/assets/photos/IMG_2528.jpg";
import photoIMG2543 from "@/assets/photos/IMG_2543.jpg";
import photoIMG2914 from "@/assets/photos/IMG_2914.jpg";
import photoIMG2938 from "@/assets/photos/IMG_2938.jpg";
import photoIMG3019 from "@/assets/photos/IMG_3019.jpg";
import photoIMG3030 from "@/assets/photos/IMG_3030.jpg";
import photoIMG3657 from "@/assets/photos/IMG_3657.jpg";
import photoIMG3778 from "@/assets/photos/IMG_3778.jpg";
import photoIMG3814 from "@/assets/photos/IMG_3814.jpg";
import photoIMG3844 from "@/assets/photos/IMG_3844.jpg";
import photoIMG4127 from "@/assets/photos/IMG_4127.jpg";
import photoIMG4353 from "@/assets/photos/IMG_4353.jpg";
import photoIMG4533 from "@/assets/photos/IMG_4533.jpg";
import photoIMG4619 from "@/assets/photos/IMG_4619.jpg";
import photoIMG4689 from "@/assets/photos/IMG_4689.jpg";
import photoIMG4846 from "@/assets/photos/IMG_4846_2.jpg";
import photoIMG5744 from "@/assets/photos/IMG_5744.jpg";
import photoIMG6279 from "@/assets/photos/IMG_6279.jpg";
import photoIMG6480 from "@/assets/photos/IMG_6480.jpg";
import photoIMG6666 from "@/assets/photos/IMG_6666.jpg";
import photoIMG6697 from "@/assets/photos/IMG_6697.jpg";
import photoIMG6708 from "@/assets/photos/IMG_6708.jpg";
import photoIMG7209 from "@/assets/photos/IMG_7209.jpg";
import photoIMG7397 from "@/assets/photos/IMG_7397_2.jpg";
import photoIMG7569 from "@/assets/photos/IMG_7569_2.jpg";
import photoIMG7708 from "@/assets/photos/IMG_7708.jpg";
import photoIMG7730 from "@/assets/photos/IMG_7730_2.jpg";
import photoIMG7740 from "@/assets/photos/IMG_7740.jpg";
import photoIMG7753 from "@/assets/photos/IMG_7753.jpg";
import photoIMG7925 from "@/assets/photos/IMG_7925_2.jpg";
import photoIMG8017 from "@/assets/photos/IMG_8017.jpg";
import photoIMG8513 from "@/assets/photos/IMG_8513_2.jpg";
import photoIMG8809 from "@/assets/photos/IMG_8809_2.jpg";
import photoIMG8831 from "@/assets/photos/IMG_8831.jpg";
import photoIMG9387 from "@/assets/photos/IMG_9387.jpg";
import photoIMG9478 from "@/assets/photos/IMG_9478.jpg";
import photoIMG9887 from "@/assets/photos/IMG_9887.jpg";
import photoIMG9993 from "@/assets/photos/IMG_9993.jpg";

const PHOTO_SRCS = [
  parisSrc,
  annecySrc,
  beachSrc,
  mountainsSrc,
  netherlandsSrc,
  photo1,
  photo2,
  photo3,
  photoIMG1412,
  photoIMG1506,
  photoIMG1554,
  photoIMG1804,
  photoIMG2503,
  photoIMG2528,
  photoIMG2543,
  photoIMG2914,
  photoIMG2938,
  photoIMG3019,
  photoIMG3030,
  photoIMG3657,
  photoIMG3778,
  photoIMG3814,
  photoIMG3844,
  photoIMG4127,
  photoIMG4353,
  photoIMG4533,
  photoIMG4619,
  photoIMG4689,
  photoIMG4846,
  photoIMG5744,
  photoIMG6279,
  photoIMG6480,
  photoIMG6666,
  photoIMG6697,
  photoIMG6708,
  photoIMG7209,
  photoIMG7397,
  photoIMG7569,
  photoIMG7708,
  photoIMG7730,
  photoIMG7740,
  photoIMG7753,
  photoIMG7925,
  photoIMG8017,
  photoIMG8513,
  photoIMG8809,
  photoIMG8831,
  photoIMG9387,
  photoIMG9478,
  photoIMG9887,
  photoIMG9993,
];

const PLANE_COUNT = 120;
const CANVAS_SIZE = 600;
const IMG_SIZE = 512;
const PADDING = (CANVAS_SIZE - IMG_SIZE) / 2;
const CORNER_RADIUS = 32;

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function createImageTexture(img: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d")!;

  // Draw shadow/glow beneath the image
  ctx.save();
  ctx.shadowColor = "rgba(200, 180, 220, 0.55)";
  ctx.shadowBlur = 38;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "rgba(255, 255, 255, 0.01)"; // near-invisible fill just to trigger shadow
  roundedRect(ctx, PADDING, PADDING, IMG_SIZE, IMG_SIZE, CORNER_RADIUS);
  ctx.fill();
  ctx.restore();

  // Clip and draw image with rounded corners
  ctx.save();
  roundedRect(ctx, PADDING, PADDING, IMG_SIZE, IMG_SIZE, CORNER_RADIUS);
  ctx.clip();

  // Cover-fit: center-crop image to square
  const { naturalWidth: nw, naturalHeight: nh } = img;
  let sx = 0,
    sy = 0,
    sw = nw,
    sh = nh;
  if (nw > nh) {
    sw = nh;
    sx = (nw - sw) / 2;
  } else {
    sh = nw;
    sy = (nh - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, PADDING, PADDING, IMG_SIZE, IMG_SIZE);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

interface PlaneEntry {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  floatPhase: THREE.Vector3;
  floatSpeed: THREE.Vector3;
  floatAmp: THREE.Vector3;
}

export default function Journey() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ─── Renderer ───────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    // ─── Scene & Camera ─────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );
    camera.position.set(0, 0, 170);

    // ─── Lighting ────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.0));

    // ─── Plane data ──────────────────────────────────────────────────────────
    const planes: PlaneEntry[] = [];

    function spawnPlanes(textures: THREE.CanvasTexture[]) {
      const SPHERE_RADIUS = 65;

      for (let i = 0; i < PLANE_COUNT; i++) {
        const texIndex = i % textures.length;
        const tex = textures[texIndex];

        // Slightly varying sizes (but account for the padding in our canvas)
        // The visual image occupies IMG_SIZE/CANVAS_SIZE of the plane
        const baseSize = THREE.MathUtils.randFloat(9, 17);
        const geom = new THREE.PlaneGeometry(baseSize, baseSize);
        const mat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        const mesh = new THREE.Mesh(geom, mat);

        // Distribute across a sphere surface (uniform distribution)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = THREE.MathUtils.randFloat(SPHERE_RADIUS * 0.85, SPHERE_RADIUS * 1.15);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.cos(phi);
        const z = r * Math.sin(phi) * Math.sin(theta);

        mesh.position.set(x, y, z);
        // Face each plane toward the sphere center so images are visible from inside
        mesh.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(mesh);

        planes.push({
          mesh,
          basePos: new THREE.Vector3(x, y, z),
          floatPhase: new THREE.Vector3(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          ),
          floatSpeed: new THREE.Vector3(
            THREE.MathUtils.randFloat(0.25, 0.6),
            THREE.MathUtils.randFloat(0.2, 0.5),
            THREE.MathUtils.randFloat(0.1, 0.28)
          ),
          floatAmp: new THREE.Vector3(
            THREE.MathUtils.randFloat(0.18, 0.55),
            THREE.MathUtils.randFloat(0.15, 0.45),
            THREE.MathUtils.randFloat(0.08, 0.25)
          ),
        });
      }
      setLoaded(true);
    }

    // ─── Load images & build textures ────────────────────────────────────────
    const textures: (THREE.CanvasTexture | null)[] = new Array(
      PHOTO_SRCS.length
    ).fill(null);
    let loadedCount = 0;

    PHOTO_SRCS.forEach((src, idx) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        textures[idx] = createImageTexture(img);
        loadedCount++;
        if (loadedCount === PHOTO_SRCS.length) {
          spawnPlanes(textures as THREE.CanvasTexture[]);
        }
      };
      img.onerror = () => {
        // Use a placeholder grey texture if image fails
        const canvas = document.createElement("canvas");
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#333";
        roundedRect(ctx, PADDING, PADDING, IMG_SIZE, IMG_SIZE, CORNER_RADIUS);
        ctx.fill();
        textures[idx] = new THREE.CanvasTexture(canvas);
        loadedCount++;
        if (loadedCount === PHOTO_SRCS.length) {
          spawnPlanes(textures as THREE.CanvasTexture[]);
        }
      };
      img.src = src;
    });

    // ─── Interaction state ────────────────────────────────────────────────────
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };
    // Velocity for inertia (radians per frame)
    let velAzimuth = 0;
    let velElevation = 0;
    // Spherical camera coordinates: azimuth (horizontal), elevation (vertical), radius (zoom)
    const INITIAL_RADIUS = 170;
    const target = { azimuth: 0, elevation: 0, radius: INITIAL_RADIUS };
    const current = { azimuth: 0, elevation: 0, radius: INITIAL_RADIUS };
    const ROTATE_SPEED = 0.004;
    const ZOOM_SPEED = 0.05;
    const EASING = 0.08;
    const INERTIA = 0.91;
    const ZOOM_MIN = 30;
    const ZOOM_MAX = 250;
    const ELEV_LIMIT = Math.PI / 2 - 0.08;

    const clampElevation = (v: number) =>
      Math.max(-ELEV_LIMIT, Math.min(ELEV_LIMIT, v));

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouse = { x: e.clientX, y: e.clientY };
      velAzimuth = 0;
      velElevation = 0;
      renderer.domElement.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouse.x;
      const dy = e.clientY - lastMouse.y;
      velAzimuth = -dx * ROTATE_SPEED;
      velElevation = -dy * ROTATE_SPEED;
      target.azimuth += velAzimuth;
      target.elevation = clampElevation(target.elevation + velElevation);
      lastMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
      renderer.domElement.style.cursor = "grab";
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      target.radius += e.deltaY * ZOOM_SPEED;
      target.radius = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, target.radius));
    };

    // Touch support
    let lastTouch = { x: 0, y: 0 };
    const onTouchStart = (e: TouchEvent) => {
      isDragging = true;
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      velAzimuth = 0;
      velElevation = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - lastTouch.x;
      const dy = e.touches[0].clientY - lastTouch.y;
      velAzimuth = -dx * ROTATE_SPEED;
      velElevation = -dy * ROTATE_SPEED;
      target.azimuth += velAzimuth;
      target.elevation = clampElevation(target.elevation + velElevation);
      lastTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    // Pinch-to-zoom
    let lastPinchDist = 0;
    const onTouchStartPinch = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };
    const onTouchMovePinch = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = lastPinchDist - dist;
        target.radius += delta * 0.1;
        target.radius = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, target.radius));
        lastPinchDist = dist;
      }
    };

    const el = renderer.domElement;
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchstart", onTouchStartPinch, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchmove", onTouchMovePinch, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    // ─── Resize ───────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ─── Animation loop ───────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Apply inertia when not dragging
      if (!isDragging) {
        target.azimuth += velAzimuth;
        target.elevation = clampElevation(target.elevation + velElevation);
        velAzimuth *= INERTIA;
        velElevation *= INERTIA;
      }

      // Smooth camera lerp (azimuth needs shortest-path interpolation)
      current.azimuth += (target.azimuth - current.azimuth) * EASING;
      current.elevation += (target.elevation - current.elevation) * EASING;
      current.radius += (target.radius - current.radius) * EASING;

      // Convert spherical coords to Cartesian camera position
      const camX =
        current.radius *
        Math.cos(current.elevation) *
        Math.sin(current.azimuth);
      const camY = current.radius * Math.sin(current.elevation);
      const camZ =
        current.radius *
        Math.cos(current.elevation) *
        Math.cos(current.azimuth);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      // Subtle floating animation per plane; orient each plane to face camera
      for (const p of planes) {
        p.mesh.position.x =
          p.basePos.x +
          Math.sin(elapsed * p.floatSpeed.x + p.floatPhase.x) * p.floatAmp.x;
        p.mesh.position.y =
          p.basePos.y +
          Math.sin(elapsed * p.floatSpeed.y + p.floatPhase.y) * p.floatAmp.y;
        p.mesh.position.z =
          p.basePos.z +
          Math.sin(elapsed * p.floatSpeed.z + p.floatPhase.z) * p.floatAmp.z;
        // Keep each plane facing outward (away from sphere center) so the
        // image is always legible as the camera rotates around the sphere.
        p.mesh.lookAt(camera.position);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchstart", onTouchStartPinch);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchmove", onTouchMovePinch);
      el.removeEventListener("touchend", onTouchEnd);

      // Dispose geometries, materials, textures
      for (const p of planes) {
        p.mesh.geometry.dispose();
        (p.mesh.material as THREE.MeshBasicMaterial).dispose();
      }
      renderer.dispose();
      if (container.contains(el)) container.removeChild(el);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Three.js canvas mount point */}
      <div
        ref={mountRef}
        className="w-full h-full"
        style={{ cursor: "grab" }}
      />

      {/* Loading overlay */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20 pointer-events-none">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mb-4" />
          <p className="font-elegant text-white/50 text-sm tracking-widest uppercase">
            Loading Gallery
          </p>
        </div>
      )}

      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white/60 hover:text-white font-elegant text-xs tracking-widest uppercase transition-colors duration-300"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </Link>

      {/* Title */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pt-6 z-10 pointer-events-none">
        <p
          className="font-script text-4xl"
          style={{
            color: "rgba(255,255,255,0.80)",
            textShadow: "0 0 40px rgba(200,160,220,0.5)",
          }}
        >
          Our Journey
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <p className="font-elegant text-white text-lg font-bold tracking-widest uppercase">
          Drag to explore&nbsp;&nbsp;·&nbsp;&nbsp;Scroll to zoom
        </p>
      </div>
    </div>
  );
}
