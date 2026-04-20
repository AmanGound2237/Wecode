"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/* ── Types ── */
type UploadPhase =
  | "idle"
  | "dragging"
  | "reading"
  | "decrypting"
  | "error";

const BINARY_CHARS = ["0", "1"];

/* ── Animated binary stream (pure CSS + inline) ── */
function BinaryStream() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-20"
    >
      {Array.from({ length: 12 }).map((_, col) => (
        <div
          key={col}
          className="absolute top-0 flex flex-col gap-0.5 font-mono text-xs text-green-500"
          style={{
            left: `${(col / 12) * 100}%`,
            animationDelay: `${col * 0.18}s`,
            animation: `data-fall ${2 + (col % 3)}s linear infinite`,
          }}
        >
          {Array.from({ length: 20 }).map((_, row) => (
            <span key={row}>
              {BINARY_CHARS[Math.floor(Math.random() * 2)]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Loading Terminal Output ── */
const DECRYPT_LINES = [
  "> establishing neural link...",
  "> parsing document structure...",
  "> extracting knowledge graph...",
  "> running gemini inference...",
  "> generating prerequisite map...",
  "> compiling implementation steps...",
  "> building curriculum scaffold...",
];

function DecryptingState() {
  return (
    <div className="flex w-full flex-col items-center gap-6 py-8">
      <div className="relative flex items-center justify-center">
        {/* Pulsing outer ring */}
        <div className="absolute h-24 w-24 animate-ping rounded-full border border-green-500 opacity-20" />
        <div className="absolute h-16 w-16 animate-ping rounded-full border border-green-400 opacity-30" style={{ animationDelay: "0.3s" }} />
        {/* Core icon */}
        <div className="relative flex h-12 w-12 items-center justify-center border border-green-500 bg-green-950/40 glow-border-md">
          <span className="font-mono text-xl text-green-400">⬡</span>
        </div>
      </div>
      <div className="w-full max-w-sm space-y-1 font-mono text-xs">
        {DECRYPT_LINES.map((line, i) => (
          <div
            key={line}
            className="flex items-center gap-2 text-green-400"
            style={{
              opacity: 0,
              animation: `fadeInLine 0.4s ease forwards`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            <span className="text-green-600">▸</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
      <p className="terminal-label animate-pulse">
        [ decrypting paper... do not close tab ]
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════ */
export default function UplinkPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  /* ── Helpers ── */
  const setError = (msg: string) => {
    setErrorMsg(msg);
    setPhase("error");
  };

  const processFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
        setError(">> ERROR: Only .pdf files are accepted.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError(">> ERROR: File exceeds 10MB limit.");
        return;
      }

      setFileName(file.name);
      setPhase("reading"); // The visual loading pulse begins

      try {
        setPhase("decrypting");
        const formData = new FormData();
        formData.append("pdfFile", file);

        const res = await fetch("/api/papers/breakdown", {
          method: "POST",
          body: formData, // the browser naturally sets the content-type to multipart boundary
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        const data = await res.json();

        if (!res.ok) {
          setError(`>> API ERROR: ${data.error ?? "Unknown failure."}`);
          return;
        }

        // Navigate to the neural workspace with the paper's ID
        router.push(`/uplink/${data.paper.id}`);
      } catch (err: any) {
        setError(`>> NETWORK ERROR: ${err.message}`);
      }
    },
    [router]
  );

  /* ── Drag handlers ── */
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setPhase((prev) => (prev === "idle" || prev === "dragging" ? "dragging" : prev));
  }, []);

  const onDragLeave = useCallback(() => {
    setPhase((prev) => (prev === "dragging" ? "idle" : prev));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const isProcessing = phase === "reading" || phase === "decrypting";
  const isDragging = phase === "dragging";

  return (
    <>
      {/* Keyframe for the line fade-in animation */}
      <style>{`
        @keyframes fadeInLine {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-14">
        {/* ── Header ── */}
        <div className="flex flex-col gap-3">
          <p className="terminal-label">// uplink terminal</p>
          <h1 className="font-mono text-4xl font-bold text-green-400 glow-text sm:text-5xl">
            Upload Research Paper
            <span className="typing-cursor" />
          </h1>
          <p className="max-w-xl text-gray-400">
            Drop any AI research paper. Gemini will parse it, extract deep concepts,
            and generate an interactive coding curriculum in seconds.
          </p>
        </div>

        {/* ── Drop Zone ── */}
        <div
          id="uplink-dropzone"
          className="relative overflow-hidden rounded-sm transition-all duration-300"
          style={{
            border: isDragging
              ? "2px dashed #4ade80"
              : phase === "error"
              ? "2px dashed rgba(239,68,68,0.5)"
              : "2px dashed rgba(34,197,94,0.25)",
            background: isDragging
              ? "rgba(34,197,94,0.05)"
              : "rgba(10,15,10,0.8)",
            boxShadow: isDragging
              ? "0 0 40px rgba(34,197,94,0.15), inset 0 0 60px rgba(34,197,94,0.04)"
              : "inset 0 0 40px rgba(0,0,0,0.4)",
            minHeight: "380px",
          }}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {/* Binary rain behind dropzone */}
          <BinaryStream />

          <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-12 text-center">
            {isProcessing ? (
              <DecryptingState />
            ) : phase === "error" ? (
              <>
                <div className="border border-red-900/50 bg-red-950/20 px-4 py-2 font-mono text-sm text-red-400">
                  {errorMsg}
                </div>
                <button
                  className="btn-outline text-xs"
                  onClick={() => { setPhase("idle"); setErrorMsg(null); }}
                >
                  [ retry connection ]
                </button>
              </>
            ) : (
              <>
                {/* Central icon */}
                <div
                  className="relative flex h-20 w-20 items-center justify-center transition-all duration-300"
                  style={{
                    border: `1px solid ${isDragging ? "#4ade80" : "rgba(34,197,94,0.4)"}`,
                    background: isDragging ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.04)",
                    boxShadow: isDragging ? "0 0 30px rgba(34,197,94,0.3)" : "0 0 10px rgba(34,197,94,0.1)",
                  }}
                >
                  <span className="font-mono text-4xl text-green-500">↓</span>
                  <div
                    className="absolute -inset-2 rounded-sm border border-green-500 opacity-20"
                    style={{
                      animation: "glow-pulse 2s ease-in-out infinite",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-lg font-bold tracking-[0.2em] text-green-400 glow-text-sm">
                    {isDragging
                      ? "[ RELEASE TO UPLOAD ]"
                      : "[ AWAITING DATA STREAM ]"}
                  </p>
                  <p className="font-mono text-sm tracking-widest text-green-600">
                    DROP .PDF HERE TO BEGIN NEURAL ANALYSIS
                  </p>
                  <p className="font-mono text-xs text-gray-600">
                    or browse local filesystem
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn-primary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    [ select file ]
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="sr-only"
                    onChange={onFileChange}
                  />
                </div>

                {/* Specs row */}
                <div className="mt-2 flex flex-wrap gap-6 font-mono text-xs text-gray-600">
                  <span>
                    <span className="text-green-700">FORMAT:</span> .pdf
                  </span>
                  <span>
                    <span className="text-green-700">MAX SIZE:</span> 10MB
                  </span>
                  <span>
                    <span className="text-green-700">ENGINE:</span> gemini-flash
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Corner decorations */}
          {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map(
            (pos) => (
              <div
                key={pos}
                className={`absolute ${pos} h-4 w-4 border-green-500`}
                style={{
                  borderWidth: pos.includes("top-0 left-0")
                    ? "2px 0 0 2px"
                    : pos.includes("top-0 right-0")
                    ? "2px 2px 0 0"
                    : pos.includes("bottom-0 left-0")
                    ? "0 0 2px 2px"
                    : "0 2px 2px 0",
                  opacity: 0.6,
                }}
              />
            )
          )}
        </div>

        {/* ── Info Row ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: "🧠", label: "Parse", desc: "Extracts insights from raw PDF text." },
            { icon: "⚡", label: "Generate", desc: "Gemini builds a step-by-step curriculum." },
            { icon: "💻", label: "Code", desc: "Implement each step in the live editor." },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="card-surface flex items-start gap-3 rounded-sm p-4"
            >
              <span className="text-xl">{icon}</span>
              <div>
                <p className="terminal-label">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
