"use client";

import { useEffect, useRef } from "react";
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  EdgesGeometry,
  Fog,
  GridHelper,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
  type Object3D,
} from "three";
import { SHAPE_EVENT, latestShape, type ShapeDetail } from "./shape-events";
import type { ShapeName } from "./stations";

/* ─────────────────────────────────────────────────────────────────────────
   The workbench: an outlined, blueprint-noir 3D scene. One object per
   domain; the camera flies between them ("perspectives") as the story
   advances and the active station lights up in its accent.
   ───────────────────────────────────────────────────────────────────────── */

const INK = new Color("#d6d6d6");
const DIM_OPACITY = 0.28;

type Shot = { pos: Vector3; look: Vector3 };

// Camera framing per station (desktop). Mobile pulls back along the same ray.
const SHOTS: Record<ShapeName, Shot> = {
  core: { pos: new Vector3(0.6, 4.6, 6.6), look: new Vector3(0, 0.3, 0) },
  network: { pos: new Vector3(-0.7, 1.75, 2.6), look: new Vector3(-2.6, 0.95, -0.5) },
  globe: { pos: new Vector3(-0.3, 1.05, 2.0), look: new Vector3(-1.1, 0.42, 0.15) },
  phone: { pos: new Vector3(0.95, 1.0, 2.15), look: new Vector3(0.15, 0.32, 0.7) },
  drone: { pos: new Vector3(2.6, 1.9, 2.5), look: new Vector3(1.2, 1.1, -0.1) },
  neural: { pos: new Vector3(2.9, 1.45, 2.7), look: new Vector3(2.15, 0.7, 0.1) },
  chip: { pos: new Vector3(0.45, 1.55, 0.75), look: new Vector3(-0.15, 0.02, -0.8) },
};

export default function Workshop() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Phones/tablets: fewer pixels and no MSAA. The thin outlines read the same at
    // 1.25x on a 3x screen, and fill-rate is what drains mobile GPUs.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const renderer = new WebGLRenderer({ antialias: !touch, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, touch ? 1.25 : 1.75));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new Scene();
    scene.fog = new Fog(0x050505, 5.5, 15);
    const camera = new PerspectiveCamera(38, 1, 0.05, 60);

    /* ── Materials & helpers ── */
    const disposables: Array<{ dispose(): void }> = [];
    const fill = new MeshBasicMaterial({
      color: 0x0b0b0b,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    });
    const red = new MeshBasicMaterial({ color: 0xe11d2a });
    const dimEdge = new LineBasicMaterial({ color: 0x5a5a5a, transparent: true, opacity: 0.55 });
    disposables.push(fill, red, dimEdge);

    const edgeMats = {} as Record<ShapeName, LineBasicMaterial>;
    const station = (name: ShapeName) => {
      const m = new LineBasicMaterial({ color: INK.clone(), transparent: true, opacity: 0.7 });
      edgeMats[name] = m;
      disposables.push(m);
      const g = new Group();
      scene.add(g);
      return { group: g, edge: m };
    };

    const solid = (
      geo: BufferGeometry,
      edge: LineBasicMaterial,
      at: [number, number, number],
      parent: Object3D,
      faceMat: MeshBasicMaterial = fill
    ) => {
      const o = new Group();
      o.add(new Mesh(geo, faceMat));
      const eg = new EdgesGeometry(geo, 25);
      o.add(new LineSegments(eg, edge));
      o.position.set(...at);
      parent.add(o);
      disposables.push(geo, eg);
      return o;
    };

    const outline = (geo: BufferGeometry, edge: LineBasicMaterial, at: [number, number, number], parent: Object3D) => {
      const eg = new EdgesGeometry(geo);
      const l = new LineSegments(eg, edge);
      l.position.set(...at);
      parent.add(l);
      disposables.push(geo, eg);
      return l;
    };

    const wire = (points: Vector3[], edge: LineBasicMaterial, parent: Object3D) => {
      const curve = new CatmullRomCurve3(points);
      const geo = new BufferGeometry().setFromPoints(curve.getPoints(24));
      parent.add(new Line(geo, edge));
      disposables.push(geo);
    };

    /* ── Ground: platform + receding grid for depth ── */
    const grid = new GridHelper(40, 56, 0x262626, 0x161616);
    grid.position.y = -0.14;
    scene.add(grid);
    disposables.push(grid.geometry, grid.material as LineBasicMaterial);
    solid(new BoxGeometry(7.6, 0.14, 3.6), dimEdge, [0, -0.07, 0.1], scene);

    /* ── Backend: server rack ── */
    const leds: Mesh[] = [];
    {
      const { group, edge } = station("network");
      group.position.set(-2.6, 0, -0.5);
      solid(new BoxGeometry(0.95, 1.95, 0.82), edge, [0, 0.975, 0], group);
      for (let i = 0; i < 7; i++) {
        const y = 0.22 + i * 0.245;
        outline(new BoxGeometry(0.8, 0.19, 0.02), edge, [0, y, 0.42], group);
        for (let k = 0; k < 3; k++) {
          const led = new Mesh(new BoxGeometry(0.035, 0.035, 0.01), red);
          led.position.set(0.22 + k * 0.06, y, 0.435);
          group.add(led);
          leds.push(led);
          disposables.push(led.geometry);
        }
      }
      wire([new Vector3(0.48, 0.3, 0.2), new Vector3(0.9, 0.05, 0.5), new Vector3(1.4, 0.02, 0.7)], edge, group);
    }

    /* ── Web: laptop with a wireframe globe on screen ── */
    let screenGlobe: Object3D | null = null;
    {
      const { group, edge } = station("globe");
      group.position.set(-1.1, 0, 0.15);
      group.rotation.y = 0.25;
      solid(new BoxGeometry(1.15, 0.05, 0.78), edge, [0, 0.025, 0], group);
      outline(new PlaneGeometry(0.95, 0.5).rotateX(-Math.PI / 2), edge, [0, 0.052, 0.06], group);
      const hinge = new Group();
      hinge.position.set(0, 0.05, -0.39);
      hinge.rotation.x = -0.24;
      group.add(hinge);
      solid(new BoxGeometry(1.15, 0.74, 0.04), edge, [0, 0.37, 0], hinge);
      outline(new PlaneGeometry(1.0, 0.04), edge, [0, 0.66, 0.025], hinge);
      outline(new PlaneGeometry(0.34, 0.42), edge, [-0.3, 0.38, 0.025], hinge);
      const geo = new WireframeGeometry(new SphereGeometry(0.17, 12, 8));
      const g = new LineSegments(geo, edge);
      g.position.set(0.22, 0.36, 0.06);
      hinge.add(g);
      disposables.push(geo);
      screenGlobe = g;
    }

    /* ── Apps: phone on a stand ── */
    {
      const { group, edge } = station("phone");
      group.position.set(0.15, 0, 0.72);
      group.rotation.y = -0.2;
      solid(new BoxGeometry(0.42, 0.04, 0.3), edge, [0, 0.02, 0], group);
      const tilt = new Group();
      tilt.position.set(0, 0.04, -0.06);
      tilt.rotation.x = -0.28;
      group.add(tilt);
      solid(new BoxGeometry(0.36, 0.7, 0.03), edge, [0, 0.35, 0], tilt);
      outline(new PlaneGeometry(0.31, 0.6), edge, [0, 0.36, 0.017], tilt);
      for (let r = 0; r < 4; r++)
        for (let c = 0; c < 3; c++)
          outline(new PlaneGeometry(0.06, 0.06), edge, [(c - 1) * 0.09, 0.56 - r * 0.1, 0.018], tilt);
    }

    /* ── UAV: quadcopter hovering with spinning props ── */
    const props: Object3D[] = [];
    let drone: Group | null = null;
    {
      const { group, edge } = station("drone");
      group.position.set(1.2, 1.1, -0.1);
      drone = group;
      solid(new BoxGeometry(0.34, 0.1, 0.46), edge, [0, 0, 0], group);
      for (const a of [Math.PI / 4, -Math.PI / 4]) {
        const arm = solid(new BoxGeometry(1.25, 0.035, 0.06), edge, [0, 0, 0], group);
        arm.rotation.y = a;
      }
      for (const [x, z] of [[0.44, 0.44], [-0.44, 0.44], [0.44, -0.44], [-0.44, -0.44]]) {
        solid(new CylinderGeometry(0.055, 0.055, 0.09, 10), edge, [x, 0.04, z], group);
        const p = new Group();
        p.position.set(x, 0.095, z);
        outline(new BoxGeometry(0.5, 0.005, 0.045), edge, [0, 0, 0], p);
        group.add(p);
        props.push(p);
      }
      const cam = new Mesh(new BoxGeometry(0.08, 0.06, 0.06), red);
      cam.position.set(0, -0.08, 0.2);
      group.add(cam);
      disposables.push(cam.geometry);
      wire([new Vector3(-0.12, -0.05, 0.12), new Vector3(-0.14, -0.22, 0.18)], edge, group);
      wire([new Vector3(0.12, -0.05, 0.12), new Vector3(0.14, -0.22, 0.18)], edge, group);
    }

    /* ── AI: edge device projecting a neural-net hologram ── */
    let holo: Group | null = null;
    const nodes: Mesh[] = [];
    {
      const { group, edge } = station("neural");
      group.position.set(2.5, 0, 0.1);
      group.rotation.y = -0.35;
      solid(new BoxGeometry(0.62, 0.18, 0.46), edge, [0, 0.09, 0], group);
      for (let i = 0; i < 5; i++) outline(new PlaneGeometry(0.42, 0.012), edge, [0, 0.12, 0.231 + 0.0005 * i], group).translateY(-0.02 * i);
      const led = new Mesh(new BoxGeometry(0.04, 0.04, 0.01), red);
      led.position.set(0.24, 0.14, 0.232);
      group.add(led);
      leds.push(led);
      disposables.push(led.geometry);
      holo = new Group();
      holo.position.set(0, 0.78, 0);
      group.add(holo);
      const layers = [3, 5, 5, 2];
      const pos = layers.map((n, li) =>
        Array.from({ length: n }, (_, k) => new Vector3(-0.45 + li * 0.3, (k - (n - 1) / 2) * 0.15, 0))
      );
      const nodeGeo = new IcosahedronGeometry(0.03, 0);
      disposables.push(nodeGeo);
      pos.flat().forEach((p, i) => {
        const m = new Mesh(nodeGeo, i % 5 === 0 ? red : fill);
        m.position.copy(p);
        holo!.add(m);
        holo!.add(new LineSegments(new EdgesGeometry(nodeGeo), edge).translateX(p.x).translateY(p.y));
        nodes.push(m);
      });
      const pts: Vector3[] = [];
      for (let l = 0; l < pos.length - 1; l++) for (const a of pos[l]) for (const b of pos[l + 1]) pts.push(a, b);
      const linkGeo = new BufferGeometry().setFromPoints(pts);
      const linkMat = new LineBasicMaterial({ color: 0x8c8c8c, transparent: true, opacity: 0.3 });
      holo.add(new LineSegments(linkGeo, linkMat));
      disposables.push(linkGeo, linkMat);
      // Light cone from device to hologram.
      wire([new Vector3(-0.2, 0.18, 0), new Vector3(-0.5, 0.62, 0)], dimEdge, group);
      wire([new Vector3(0.2, 0.18, 0), new Vector3(0.5, 0.62, 0)], dimEdge, group);
    }

    /* ── IoT: ESP32-style dev board wired to a sensor ── */
    {
      const { group, edge } = station("chip");
      group.position.set(-0.15, 0, -0.8);
      group.rotation.y = 0.12;
      solid(new BoxGeometry(0.95, 0.04, 0.55), edge, [0, 0.02, 0], group);
      solid(new BoxGeometry(0.26, 0.05, 0.26), edge, [-0.08, 0.065, 0], group);
      solid(new BoxGeometry(0.18, 0.03, 0.12), edge, [0.3, 0.055, 0.12], group);
      for (let i = 0; i < 12; i++) {
        const x = -0.4 + i * 0.072;
        outline(new BoxGeometry(0.035, 0.05, 0.035), edge, [x, 0.065, 0.24], group);
        outline(new BoxGeometry(0.035, 0.05, 0.035), edge, [x, 0.065, -0.24], group);
      }
      const led = new Mesh(new BoxGeometry(0.03, 0.02, 0.03), red);
      led.position.set(0.4, 0.05, -0.1);
      group.add(led);
      leds.push(led);
      disposables.push(led.geometry);
      solid(new BoxGeometry(0.26, 0.03, 0.2), edge, [0.95, 0.015, 0.25], group);
      solid(new CylinderGeometry(0.05, 0.05, 0.05, 12), edge, [0.95, 0.055, 0.25], group);
      for (const dz of [-0.04, 0, 0.04])
        wire([new Vector3(0.47, 0.06, 0.15 + dz), new Vector3(0.65, 0.18, 0.2 + dz), new Vector3(0.83, 0.03, 0.25 + dz)], edge, group);
    }

    /* ── State ── */
    let current: ShapeName = "core";
    const camPos = SHOTS.core.pos.clone();
    const camLook = SHOTS.core.look.clone();
    const goalPos = new Vector3();
    const goalLook = new Vector3();
    const accent = new Color("#e11d2a");
    const pointer = { x: 0, y: 0 };
    let wide = true;
    let viewX = 0;
    let viewY = 0;
    let width = 1;
    let height = 1;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const highlight = () => {
      (Object.keys(edgeMats) as ShapeName[]).forEach((k) => {
        const m = edgeMats[k];
        const on = current === "core" || k === current;
        m.userData.target = on ? (k === current ? accent.clone() : INK.clone()) : INK.clone();
        m.userData.opacity = current === "core" ? 0.72 : on ? 1 : DIM_OPACITY;
      });
    };

    const layout = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      wide = width >= 1024;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onShape = (event: Event) => {
      const detail = (event as CustomEvent<ShapeDetail>).detail;
      accent.set(detail.accent);
      current = detail.shape;
      highlight();
      if (reduced) {
        snapCamera();
        render(0);
      }
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const shotFor = (name: ShapeName, t: number) => {
      const s = SHOTS[name];
      goalPos.copy(s.pos);
      goalLook.copy(s.look);
      // Slow establishing orbit on the wide shot.
      if (name === "core" && !reduced) {
        const a = Math.sin(t * 0.08) * 0.18;
        const dx = goalPos.x - goalLook.x;
        const dz = goalPos.z - goalLook.z;
        goalPos.x = goalLook.x + dx * Math.cos(a) - dz * Math.sin(a);
        goalPos.z = goalLook.z + dx * Math.sin(a) + dz * Math.cos(a);
      }
      // Portrait screens need a longer lens distance to fit the object.
      if (!wide) goalPos.sub(goalLook).multiplyScalar(name === "core" ? 1.55 : 1.45).add(goalLook);
    };

    const snapCamera = () => {
      shotFor(current, 0);
      camPos.copy(goalPos);
      camLook.copy(goalLook);
    };

    const render = (dt: number) => {
      const t = performance.now() / 1000;
      const k = 1 - Math.exp(-dt * 2.4);

      shotFor(current, t);
      camPos.lerp(goalPos, k);
      camLook.lerp(goalLook, k);
      camera.position.set(camPos.x + pointer.x * 0.12, camPos.y - pointer.y * 0.08, camPos.z);
      camera.lookAt(camLook);

      // Shift the frame right on desktop domain shots (copy sits on the left); lift the hero.
      const tx = wide && current !== "core" ? -width * 0.15 : 0;
      // Hero: lift the bench into the open space above the cropped title.
      const ty = current === "core" ? (wide ? -height * 0.04 : height * 0.12) : wide ? 0 : height * 0.12;
      viewX += (tx - viewX) * k;
      viewY += (ty - viewY) * k;
      camera.setViewOffset(width, height, viewX, viewY, width, height);

      // Edge colours ease toward their targets.
      for (const m of Object.values(edgeMats)) {
        if (m.userData.target) m.color.lerp(m.userData.target as Color, k);
        if (typeof m.userData.opacity === "number") m.opacity += (m.userData.opacity - m.opacity) * k;
      }

      if (!reduced) {
        props.forEach((p, i) => (p.rotation.y += dt * (i % 2 ? 38 : -38)));
        if (drone) {
          // The drone leans and drifts toward the cursor, like it's tracking you.
          drone.position.x += (1.2 + pointer.x * 0.35 - drone.position.x) * k;
          drone.position.y = 1.1 + Math.sin(t * 1.6) * 0.05 - pointer.y * 0.12;
          drone.rotation.z += (-pointer.x * 0.28 + Math.sin(t * 1.1) * 0.03 - drone.rotation.z) * k;
          drone.rotation.x += (pointer.y * 0.2 - drone.rotation.x) * k;
        }
        if (holo) holo.rotation.y = Math.sin(t * 0.5) * 0.6;
        if (screenGlobe) screenGlobe.rotation.y += dt * 0.6;
        nodes.forEach((n, i) => n.scale.setScalar(1 + Math.max(0, Math.sin(t * 3 - i * 0.6)) * 0.5));
        leds.forEach((l, i) => (l.visible = Math.sin(t * (2 + (i % 5)) + i) > -0.4));
      }

      renderer.render(scene, camera);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      render(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      layout();
      if (reduced) render(0);
    });
    ro.observe(host);

    layout();
    highlight();
    const pending = latestShape();
    if (pending) {
      accent.set(pending.accent);
      current = pending.shape;
      highlight();
    }
    snapCamera();
    render(0.016);
    start();

    window.addEventListener(SHAPE_EVENT, onShape);
    // Touch has no hover; finger drags would just jolt the camera mid-scroll.
    if (!touch) window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", start);
    requestAnimationFrame(() => host.classList.add("is-ready"));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener(SHAPE_EVENT, onShape);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", start);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="point-field" aria-hidden="true" />;
}
