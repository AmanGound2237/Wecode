"use client";

import { useEffect } from "react";

export default function MatrixSanitizer() {
  useEffect(() => {
    // Function to forcefully remove Next.js dev portal specifically
    const removeDevPortal = () => {
      const portal = document.querySelector("nextjs-portal");
      if (portal) {
        portal.remove();
        console.log("[MatrixSanitizer] Exorcised Next.js Dev Indicator from the DOM.");
      }
    };

    // Run initially in case it's already there
    removeDevPortal();

    // Set up a MutationObserver to catch it if Next.js injects it later dynamically
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          removeDevPortal();
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null; // This component renders nothing
}
