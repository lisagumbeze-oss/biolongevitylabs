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

/** Official Smartsupp site key — override with NEXT_PUBLIC_SMARTSUPP_KEY in .env.local */
const SMARTSUPP_KEY =
  process.env.NEXT_PUBLIC_SMARTSUPP_KEY ??
  "066c33c30d5a0cddcfb7a8750f96fe6b77709e72";

const SMARTSUPP_BOOTSTRAP = `
var _smartsupp = _smartsupp || {};
_smartsupp.key = '${SMARTSUPP_KEY}';
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

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window._smartsupp = window._smartsupp || {};
      window._smartsupp.offsetY = 150;
      window._smartsupp.offsetX = 20;
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
