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

const LOADER_SRC = "https://www.smartsuppchat.com/loader.js?";

export default function SmartsuppWidget() {
  const pathname = usePathname();
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;

  const isAdminPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/emails-preview");

  const shouldLoad = Boolean(smartsuppKey) && !isAdminPage;

  useEffect(() => {
    if (!shouldLoad) return;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = smartsuppKey;
    window._smartsupp.color = "#137fec";

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window._smartsupp.offsetY = 150;
      window._smartsupp.offsetX = 20;
    }
  }, [shouldLoad, smartsuppKey]);

  useEffect(() => {
    if (!smartsuppKey) return;

    const forceHideWidget = () => {
      if (typeof document === "undefined") return;
      const chatNodes = document.querySelectorAll<HTMLElement>(
        'iframe[src*="smartsuppchat"], [id*="smartsupp"], [class*="smartsupp"]'
      );
      chatNodes.forEach((node) => {
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
  }, [pathname, isAdminPage, smartsuppKey, shouldLoad]);

  if (!shouldLoad) return null;

  return (
    <Script
      id="smartsupp-loader"
      src={LOADER_SRC}
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window.smartsupp === "function") {
          try {
            window.smartsupp("chat:show");
          } catch {
            /* ignore */
          }
        }
      }}
    />
  );
}
