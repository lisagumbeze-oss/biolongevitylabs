"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FLOATING_ACTION_GAP_PX,
  FLOATING_ACTION_SIZE_PX,
  SMARTSUPP_MOBILE_OFFSET_Y,
  SMARTSUPP_OFFSET_X,
} from "@/lib/brand";

const SHOW_AFTER_SCROLL_PX = 320;
const DESKTOP_CHAT_OFFSET_Y = 20;
const stackAboveChat = FLOATING_ACTION_SIZE_PX + FLOATING_ACTION_GAP_PX;

export default function BackToTopButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isAdminPage =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/emails-preview");

  useEffect(() => {
    if (isAdminPage) return;

    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [isAdminPage]);

  useEffect(() => {
    if (isAdminPage) return;

    const onScroll = () => {
      setVisible(window.scrollY > SHOW_AFTER_SCROLL_PX);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdminPage]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isAdminPage) return null;

  const chatOffsetY = isMobile ? SMARTSUPP_MOBILE_OFFSET_Y : DESKTOP_CHAT_OFFSET_Y;
  const bottomPx = chatOffsetY + stackAboveChat;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed z-[48] flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-sky-500 active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          style={{
            right: SMARTSUPP_OFFSET_X,
            bottom: `calc(${bottomPx}px + env(safe-area-inset-bottom, 0px))`,
          }}
        >
          <ChevronUp className="w-6 h-6" strokeWidth={2.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
