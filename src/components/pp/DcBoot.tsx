"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    preact?: unknown;
    __dcMount?: (name: string) => void;
    __dcDefine?: unknown;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const ex = document.querySelector<HTMLScriptElement>(`script[data-pp="${src}"]`);
    if (ex) {
      if (ex.dataset.done) resolve();
      else ex.addEventListener("load", () => resolve());
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.dataset.pp = src;
    s.onload = () => {
      s.dataset.done = "1";
      resolve();
    };
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
}

export function DcBoot({ name }: { name: string }) {
  useEffect(() => {
    let dead = false;
    (async () => {
      // Templates are shipped with <hh1> so the SSR HTML has a single <h1>;
      // restore real tags before the runtime reads them.
      document.querySelectorAll("template").forEach((t) => {
        if (t.innerHTML.includes("hh1")) t.innerHTML = t.innerHTML.replace(/<(\/?)hh1/g, "<$1h1");
      });
      await loadScript("/pp/preact.min.js");
      await loadScript("/pp/dc-runtime.js");
      if (dead) return;
      // Page script defines the components and mounts over the SSR markup.
      const s = document.createElement("script");
      s.src = `/pp/${name}.js?v=1`;
      s.dataset.ppPage = name;
      document.body.appendChild(s);
    })().catch(() => {});
    return () => {
      dead = true;
      document.querySelectorAll(`script[data-pp-page="${name}"]`).forEach((n) => n.remove());
    };
  }, [name]);
  return null;
}
