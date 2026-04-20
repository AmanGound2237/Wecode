"use client";

import { useEffect, useRef } from "react";

/**
 * MatrixBackground
 * Renders a canvas-based Matrix digital rain effect (falling 0s and 1s)
 * behind all content. Uses requestAnimationFrame for smooth animation.
 * Fixed position, negative z-index — never interferes with UI.
 */
export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const FONT_SIZE = 14;
    const CHAR_SET = "01";

    // ── Speed control ──────────────────────────────────────────
    // Only advance column positions every FRAME_SKIP rAF ticks.
    // At 60 fps, FRAME_SKIP = 8 → ~7.5 fps of movement = slow, meditative drift.
    const FRAME_SKIP = 8;
    let frameCount = 0;
    // ──────────────────────────────────────────────────────────

    let columns: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const numCols = Math.floor(canvas.width / FONT_SIZE);
      columns = Array.from({ length: numCols }, () =>
        Math.floor((Math.random() * canvas.height) / FONT_SIZE)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId: number;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      frameCount++;

      // Only redraw every FRAME_SKIP frames — this is what controls speed
      if (frameCount % FRAME_SKIP !== 0) return;

      // Slightly slower fade → tails linger longer, feel more meditative
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      columns.forEach((y, i) => {
        const char = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        const x = i * FONT_SIZE;

        // Leading character — bright head
        if (y === 0 || Math.random() > 0.97) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = "#4ade80";
          ctx.fillStyle = "#dcfce7";
        } else {
          // Trailing — dimmer green
          ctx.shadowBlur = 3;
          ctx.shadowColor = "#16a34a";
          ctx.fillStyle = "#16a34a";
        }

        ctx.fillText(char, x, y * FONT_SIZE);

        // Reset column — higher threshold = streams run longer before looping
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.985) {
          columns[i] = 0;
        } else {
          columns[i] = y + 1;
        }
      });
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* The canvas rain layer */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
          pointerEvents: "none",
        }}
      />
      {/* Dark overlay to keep the rain subtle and preserve text contrast */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.82)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
