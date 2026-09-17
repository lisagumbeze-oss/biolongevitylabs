"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    _smartsupp: Record<string, unknown>;
    smartsupp: (...args: unknown[]) => void;
  }
}

import {
  BRAND_PRIMARY,
  SMARTSUPP_MOBILE_OFFSET_Y,
  SMARTSUPP_OFFSET_X,
} from "@/lib/brand";

/** Official Smartsupp site key — override with NEXT_PUBLIC_SMARTSUPP_KEY in .env.local */
const SMARTSUPP_KEY =
  process.env.NEXT_PUBLIC_SMARTSUPP_KEY ??
  "066c33c30d5a0cddcfb7a8750f96fe6b77709e72";

const SMARTSUPP_BOOTSTRAP = `
var _smartsupp = _smartsupp || {};
_smartsupp.key = '${SMARTSUPP_KEY}';
_smartsupp.color = '${BRAND_PRIMARY}';
if (window.innerWidth < 768) {
  _smartsupp.offsetX = ${SMARTSUPP_OFFSET_X};
  _smartsupp.offsetY = ${SMARTSUPP_MOBILE_OFFSET_Y};
}
window.smartsupp||(function(d) {
  var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
  s=d.getElementsByTagName('script')[0];c=d.createElement('script');
  c.type='text/javascript';c.charset='utf-8';c.async=true;
  c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
})(document);
`;

export default function SmartsuppWidget() {
  const pathname = usePathname();

  const isAdminPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/emails-preview");

  const shouldLoad = !isAdminPage;

  useEffect(() => {
    if (!shouldLoad) return;

    const placeChat = () => {
      if (window.innerWidth >= 768) return;
      const bottom = `${SMARTSUPP_MOBILE_OFFSET_Y}px`;

      document.querySelectorAll<HTMLElement>("[data-smartsupp-id]").forEach((node) => {
        if (getComputedStyle(node).position !== "fixed") return;
        const height = node.getBoundingClientRect().height;
        if (height === 0 || height > 140) return;
        if (node.style.bottom === bottom) return;
        node.style.bottom = bottom;
        node.style.top = "auto";
      });
    };

    placeChat();
    const observer = new MutationObserver(placeChat);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    const interval = window.setInterval(placeChat, 1000);
    const stop = window.setTimeout(() => window.clearInterval(interval), 8000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(stop);
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad) return;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.color = BRAND_PRIMARY;

    if (window.innerWidth < 768) {
      window._smartsupp.offsetX = SMARTSUPP_OFFSET_X;
      window._smartsupp.offsetY = SMARTSUPP_MOBILE_OFFSET_Y;
    }
  }, [shouldLoad]);

  useEffect(() => {
    const forceHideWidget = () => {
      if (typeof document === "undefined") return;
      document
        .querySelectorAll<HTMLElement>(
          'iframe[src*="smartsuppchat"], [id*="smartsupp"], [class*="smartsupp"]'
        )
        .forEach((node) => {
          node.style.setProperty("display", "none", "important");
          node.style.setProperty("visibility", "hidden", "important");
          node.style.setProperty("opacity", "0", "important");
          node.style.setProperty("pointer-events", "none", "important");
        });
    };

    if (isAdminPage) {
      if (typeof window.smartsupp === "function") {
        try {
          window.smartsupp("chat:hide");
        } catch {
          /* not initialized */
        }
      }
      forceHideWidget();
      return;
    }

    const showChat = () => {
      if (typeof window.smartsupp === "function") {
        try {
          window.smartsupp("chat:show");
        } catch {
          /* not initialized */
        }
      }
    };

    showChat();
    const interval = setInterval(showChat, 500);
    const timeout = setTimeout(() => clearInterval(interval), 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, isAdminPage, shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <>
      <Script
        id="smartsupp-live-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{ __html: SMARTSUPP_BOOTSTRAP }}
      />
      <noscript>
        Powered by{" "}
        <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
          Smartsupp
        </a>
      </noscript>
    </>
  );
}
