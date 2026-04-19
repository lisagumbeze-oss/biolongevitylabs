"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function SmartsuppWidget() {
  const pathname = usePathname();
  const smartsuppKey = process.env.NEXT_PUBLIC_SMARTSUPP_KEY;

  // Exclude on admin dashboard and any other sensitive pages if needed
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (!smartsuppKey || isAdminPage) {
    return null;
  }

  return (
    <Script
      id="smartsupp-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window._smartsupp = window._smartsupp || {};
          window._smartsupp.key = '${smartsuppKey}';
          
          // Move widget up on mobile to avoid BottomNav
          if (window.innerWidth < 768) {
            window._smartsupp.offsetY = 100;
            window._smartsupp.offsetX = 20;
          }
          
          window.smartsupp||(function(d) {
            var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
            s=d.getElementsByTagName('script')[0];c=d.createElement('script');
            c.type='text/javascript';c.charset='utf-8';c.async=true;
            c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
          })(document);
        `
      }}
    />
  );
}
