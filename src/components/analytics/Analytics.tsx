"use client";

import { useEffect } from "react";
import Script from "next/script";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Microsoft Clarity + Firebase Analytics (GA4). Both are opt-in by env var and
 * load after the page is interactive, so they never compete with first paint.
 */
export function Analytics() {
  useEffect(() => {
    if (!firebaseConfig.apiKey || !firebaseConfig.appId || !firebaseConfig.measurementId) return;
    let cancelled = false;

    const boot = async () => {
      const [{ initializeApp, getApps }, analytics] = await Promise.all([
        import("firebase/app"),
        import("firebase/analytics"),
      ]);
      if (cancelled || !(await analytics.isSupported())) return;
      const app = getApps()[0] ?? initializeApp(firebaseConfig);
      const instance = analytics.getAnalytics(app);

      // Outbound clicks (projects, socials, resume) are the conversions that matter here.
      const onClick = (e: MouseEvent) => {
        const link = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
        if (!link || link.origin === window.location.origin) return;
        analytics.logEvent(instance, "outbound_click", {
          link_url: link.href,
          link_text: (link.dataset.track || link.textContent || "").trim().slice(0, 80),
        });
      };
      document.addEventListener("click", onClick);
      cleanup = () => document.removeEventListener("click", onClick);
    };

    let cleanup = () => {};
    const start = () => void boot();
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2000));
    if (document.readyState === "complete") idle(start);
    else window.addEventListener("load", () => idle(start), { once: true });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  if (!CLARITY_ID) return null;
  return (
    <Script id="ms-clarity" strategy="lazyOnload">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(CLARITY_ID)});`}
    </Script>
  );
}
