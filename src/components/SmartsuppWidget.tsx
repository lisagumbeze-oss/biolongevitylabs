"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SmartsuppWidget() {
  const pathname = usePathname();
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;
  const [isLoaded, setIsLoaded] = useState(false);

  // Exclude on admin dashboard and any other sensitive pages
  const isAdminPage = pathname?.startsWith("/admin") || 
                      pathname?.startsWith("/dashboard") ||
                      pathname?.startsWith("/emails-preview");
  
  useEffect(() => {
    // Only attempt to control visibility if the script is loaded and window.smartsupp exists
    const controlChat = () => {
      if (typeof window !== "undefined" && (window as any).smartsupp) {
        if (isAdminPage) {
          (window as any).smartsupp('chat:hide');
        } else {
          (window as any).smartsupp('chat:show');
        }
      }
    };

    // Run immediately
    controlChat();
    
    // Also run after a short delay to ensure the widget has initialized
    const timer = setTimeout(controlChat, 1000);
    return () => clearTimeout(timer);
  }, [pathname, isAdminPage, isLoaded]);

  if (!smartsuppKey) {
    return null;
  }

  return (
    <Script
      id="smartsupp-script"
      strategy="afterInteractive"
      onLoad={() => setIsLoaded(true)}
      dangerouslySetInnerHTML={{
        __html: `
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = '${smartsuppKey}';
          
          // Move widget up on mobile to avoid BottomNav
          if (window.innerWidth < 768) {
            window._smartsupp.offsetY = 150;
            window._smartsupp.offsetX = 20;
          }
          
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js';s.parentNode.insertBefore(c,s);
          })(document);
        `
      }}
    />
  );
}

