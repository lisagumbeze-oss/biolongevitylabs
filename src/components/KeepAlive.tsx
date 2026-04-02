'use client';

import { useEffect } from 'react';

export function KeepAlive() {
  useEffect(() => {
    // Ping the server every 10 minutes to prevent Render from sleeping
    // while a user has the site open.
    const interval = setInterval(() => {
      fetch('/api/ping').catch(() => {
        // Silently ignore ping errors
      });
    }, 10 * 60 * 1000);

    // Initial ping
    fetch('/api/ping').catch(() => {});

    return () => clearInterval(interval);
  }, []);

  return null; // Invisible component
}
