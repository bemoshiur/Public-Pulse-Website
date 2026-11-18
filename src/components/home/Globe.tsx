"use client";

import { useEffect, useRef } from "react";

// Interactive dot-globe: Dhaka hub with live arcs to the USA (green) and a
// branch link to Seoul (red). Drag to spin. Pure Canvas 2D — no deps.
// Respects prefers-reduced-motion (renders one still frame, no spin).

const RED = "#DE2A22";
const GREEN = "#4BE38F";
const D = Math.PI / 180;

type V3 = [number, number, number];
const toV = (lat: number, lon: number): V3 => [
  Math.cos(lat * D) * Math.cos(lon * D),
  Math.sin(lat * D),
  Math.cos(lat * D) * Math.sin(lon * D),
];

// [lat, lon, lat-radius, lon-radius] rough continent blobs
const BLOBS: number[][] = [[48,-100,20,32],[32,-96,11,20],[62,-140,9,26],[60,-100,10,30],[19,-100,8,10],[12,-86,6,6],[72,-42,9,16],[-6,-62,15,18],[-24,-58,13,11],[-42,-68,10,5],[50,10,11,18],[60,22,8,18],[42,-4,5,6],[64,14,6,8],[12,15,14,24],[-10,25,14,12],[-26,25,9,10],[26,14,9,24],[56,90,14,50],[40,100,12,28],[32,70,9,18],[25,45,9,12],[21,78,10,8],[24,90,3,3],[14,102,7,5],[-3,115,5,15],[-24,134,10,17],[36,138,6,4],[37,127.6,2.6,1.4],[66,170,6,15],[-40,174,5,3],[8,-73,5,6]];

function isLand(lat: number, lon: number) {
  for (const b of BLOBS) {
    let dl = lon - b[1];
    if (dl > 180) dl -= 360;
    if (dl < -180) dl += 360;
    const a = (lat - b[0]) / b[2];
    const c = dl / b[3];
    if (a * a + c * c < 1) return true;
  }
  return false;
}

function slerp(p: V3, q: V3, t: number): V3 {
  const d = Math.max(-1, Math.min(1, p[0] * q[0] + p[1] * q[1] + p[2] * q[2]));
  const w = Math.acos(d);
  const s = Math.sin(w) || 1;
  const a = Math.sin((1 - t) * w) / s;
  const b = Math.sin(t * w) / s;
  return [a * p[0] + b * q[0], a * p[1] + b * q[1], a * p[2] + b * q[2]];
}

export function Globe({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pts: { v: V3; land: boolean; near: boolean }[] = [];
    const N = 2600;
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * 2.399963;
      const v: V3 = [Math.cos(th) * r, y, Math.sin(th) * r];
      const lat = Math.asin(y) / D;
      const lon = Math.atan2(v[2], v[0]) / D;
      const land = isLand(lat, lon);
      if (land || i % 3 === 0) {
        const near = land && Math.abs(lat - 23.8) < 7 && Math.abs(lon - 90.4) < 9;
        pts.push({ v, land, near });
      }
    }
    const dhaka = toV(23.81, 90.41);
    const seoul = toV(37.57, 126.98);
    const targets = [toV(40.71, -74.0), toV(34.05, -118.24), toV(41.88, -87.63), toV(29.76, -95.37), toV(47.61, -122.33)];
    const mk = (q: V3, lift: number, kind: "us" | "kr") => {
      const out: V3[] = [];
      for (let i = 0; i <= 64; i++) {
        const t = i / 64;
        const v = slerp(dhaka, q, t);
        const h = 1 + lift * Math.sin(Math.PI * t);
        out.push([v[0] * h, v[1] * h, v[2] * h]);
      }
      return { pts: out, kind };
    };
    const arcs = targets.map((q) => mk(q, 0.28, "us")).concat([mk(seoul, 0.16, "kr")]);

    let rot = -0.6, vel = 0, tilt = 0.5;
    let drag: { x: number; y: number; r: number; t: number } | null = null;
    let lastDx = 0, raf = 0, dead = false;

    const down = (e: PointerEvent) => {
      drag = { x: e.clientX, y: e.clientY, r: rot, t: tilt };
      lastDx = 0;
      try { cv.setPointerCapture(e.pointerId); } catch {}
    };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      vel = (dx - lastDx) * 0.006;
      lastDx = dx;
      rot = drag.r + dx * 0.006;
      tilt = Math.max(0.05, Math.min(0.95, drag.t + dy * 0.004));
    };
    const up = () => { drag = null; };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    const draw = () => {
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      const w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() / 1000;
      if (!drag && !reduce) { rot += 0.0022 + vel; vel *= 0.95; }
      const ca = Math.cos(rot), sa = Math.sin(rot), cb = Math.cos(tilt), sb = Math.sin(tilt);
      const cx = w / 2, cy = h / 2, R = Math.min(w, h) * 0.39;
      const P = (v: V3) => {
        const X = v[0] * ca + v[2] * sa, Z = -v[0] * sa + v[2] * ca, Y = v[1];
        const Y2 = Y * cb - Z * sb, Z2 = Y * sb + Z * cb;
        return { x: cx + X * R, y: cy - Y2 * R, z: Z2, hid: Z2 < 0 && X * X + Y2 * Y2 < 1 };
      };
      const g = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.3);
      g.addColorStop(0, "rgba(222,42,34,0.16)"); g.addColorStop(1, "rgba(222,42,34,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const body = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
      body.addColorStop(0, "#1A1D1A"); body.addColorStop(1, "#0C0E0C");
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = body; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = "rgba(242,240,234,0.14)"; ctx.stroke();
      for (const p of pts) {
        const q = P(p.v); if (q.z < 0) continue;
        const s = p.land ? 2.1 : 1.1;
        ctx.globalAlpha = p.land ? 0.25 + 0.75 * q.z : 0.12 * q.z;
        ctx.fillStyle = p.near ? RED : "#E6E8E2";
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      arcs.forEach((arc, i) => {
        const pr = arc.pts.map(P), kr = arc.kind === "kr", col = kr ? RED : GREEN;
        ctx.lineWidth = 1;
        for (let k = 1; k < pr.length; k++) {
          const a = pr[k - 1], b = pr[k]; if (a.hid || b.hid) continue;
          ctx.strokeStyle = kr ? "rgba(222,42,34,0.4)" : "rgba(75,227,143,0.22)";
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        const u = (t * 0.28 + i * 0.2) % 1, tail = 0.22;
        ctx.lineWidth = 2.4; ctx.lineCap = "round";
        for (let k = 1; k < pr.length; k++) {
          const tk = k / (pr.length - 1); if (tk > u || tk < u - tail) continue;
          const a = pr[k - 1], b = pr[k]; if (a.hid || b.hid) continue;
          ctx.globalAlpha = 1 - (u - tk) / tail; ctx.strokeStyle = col;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        const e = pr[pr.length - 1];
        if (!e.hid && !kr) {
          const ph = (t * 0.9 + i * 0.3) % 1;
          ctx.beginPath(); ctx.arc(e.x, e.y, 3 + ph * 12, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(75,227,143," + (0.6 * (1 - ph)).toFixed(3) + ")"; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, Math.PI * 2); ctx.fillStyle = GREEN; ctx.fill();
        }
      });
      const label = (v: V3, text: string, dot: string, r: number, ring: string) => {
        const q = P(v); if (q.hid) return;
        const ph = (t * 0.8) % 1;
        ctx.beginPath(); ctx.arc(q.x, q.y, r + ph * 18, 0, Math.PI * 2);
        ctx.strokeStyle = ring.replace("A", (0.7 * (1 - ph)).toFixed(3)); ctx.lineWidth = 1.4; ctx.stroke();
        ctx.beginPath(); ctx.arc(q.x, q.y, r, 0, Math.PI * 2); ctx.fillStyle = dot; ctx.fill();
        ctx.beginPath(); ctx.arc(q.x, q.y, r * 0.4, 0, Math.PI * 2); ctx.fillStyle = dot === GREEN ? "#0B0C0B" : "#FFFFFF"; ctx.fill();
        ctx.font = "800 13px sans-serif"; ctx.fillStyle = "#F2F0EA"; ctx.fillText(text, q.x + 12, q.y + 4);
      };
      label(seoul, "SEOUL", RED, 4.5, "rgba(222,42,34,A)");
      label(targets[0], "USA", GREEN, 6, "rgba(75,227,143,A)");
      label(dhaka, "DHAKA", RED, 6, "rgba(222,42,34,A)");
    };

    if (reduce) {
      draw();
    } else {
      const loop = () => { if (dead) return; draw(); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    }
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="Globe showing Public Pulse in Dhaka connected to clients in the USA and a branch in Seoul"
      className={`h-full w-full cursor-grab touch-pan-y active:cursor-grabbing ${className}`}
    />
  );
}
