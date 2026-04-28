"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    _smartsupp: any;
    smartsupp: any;
  }
}

export default function SmartsuppWidget() {
  const pathname = usePathname();
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;

  // Exclude on admin dashboard and any other sensitive pages
  const isAdminPage = pathname?.startsWith("/admin") || 
                      pathname?.startsWith("/dashboard") ||
                      pathname?.startsWith("/emails-preview");
  
  useEffect(() => {
    if (!smartsuppKey) return;

    // Load the script if it hasn't been loaded yet
    if (!window.smartsupp) {
      window._smartsupp = window._smartsupp || {};
      window._smartsupp.key = smartsuppKey;
      
      // Move widget up on mobile to avoid BottomNav
      if (window.innerWidth < 768) {
        window._smartsupp.offsetY = 150;
        window._smartsupp.offsetX = 20;
      }
      
      (function(d) {
        var s,c,o: any=window.smartsupp=function(){ o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];
        c=d.createElement('script');
        c.type='text/javascript';
        c.charset='utf-8';
        c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';
        if (s && s.parentNode) {
          s.parentNode.insertBefore(c,s);
        } else {
          d.head.appendChild(c);
        }
      })(document);
    }

    // Attempt to control visibility
    const controlChat = () => {
      if (typeof window !== "undefined" && typeof window.smartsupp === "function") {
        try {
          if (isAdminPage) {
            window.smartsupp('chat:hide');
          } else {
            window.smartsupp('chat:show');
          }
        } catch (e) {
          console.warn("Smartsupp not fully initialized yet for commands");
        }
      }
    };

    // Run immediately and also retry a few times to ensure it catches the loaded state
    controlChat();
    const interval = setInterval(controlChat, 500);
    const timeout = setTimeout(() => clearInterval(interval), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname, isAdminPage, smartsuppKey]);

  return null;
}
