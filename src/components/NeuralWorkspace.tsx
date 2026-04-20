"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import CyberEditor — Monaco is large and must be client-only
const CyberEditor = dynamic(() => import("@/components/CyberEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-black">
      <p className="terminal-label animate-pulse">// initialising cyber-editor...</p>
    </div>
  ),
});
import type {
  ResearchPaper,
  Prerequisite,
  ImplementationStep,
} from "@prisma/client";

/* ── Extended type with relations ── */
type PaperWithRelations = ResearchPaper & {
  prerequisites: Prerequisite[];
  steps: ImplementationStep[];
};

type Props = {
  paper: PaperWithRelations;
};

/* ── Resource type → icon map ── */
const RESOURCE_ICONS: Record<string, string> = {
  math: "∑",
  concept: "◈",
  framework: "⬡",
  paper: "⊡",
  video: "▶",
  article: "⊟",
};

/* ══════════════════════════════════════════════════
   LEFT PANEL — The Breakdown
   ══════════════════════════════════════════════════ */
function BreakdownPanel({
  paper,
  activeStep,
  onSelectStep,
}: {
  paper: PaperWithRelations;
  activeStep: number;
  onSelectStep: (i: number) => void;
}) {
  const [prereqOpen, setPrereqOpen] = useState(true);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ borderRight: "1px solid rgba(34,197,94,0.15)" }}
    >
      {/* Panel header */}
      <div
        className="flex shrink-0 items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(34,197,94,0.12)" }}
      >
        <div>
          <p className="terminal-label">// breakdown</p>
          <p className="mt-0.5 font-mono text-xs text-gray-600">
            {paper.steps.length} steps · {paper.prerequisites.length} prereqs
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="status-dot online" />
          <span className="font-mono text-xs text-green-600">READY</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {/* Paper meta */}
        <div>
          <h2 className="font-mono text-base font-bold text-green-400 glow-text-sm leading-snug">
            {paper.title}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-gray-500">
            {Array.isArray(paper.authors) ? (paper.authors as string[]).join(", ") : paper.authors}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {paper.abstract.slice(0, 280)}{paper.abstract.length > 280 ? "…" : ""}
          </p>
        </div>

        {/* Prerequisites */}
        <div>
          <button
            className="flex w-full items-center justify-between"
            onClick={() => setPrereqOpen((o) => !o)}
          >
            <p className="terminal-label">// prerequisites</p>
            <span className="font-mono text-xs text-green-700">
              {prereqOpen ? "▼" : "▶"}
            </span>
          </button>

          {prereqOpen && (
            <div className="mt-3 space-y-2">
              {paper.prerequisites.map((pre) => (
                <div
                  key={pre.id}
                  className="rounded-sm p-3 transition-colors"
                  style={{
                    border: "1px solid rgba(34,197,94,0.12)",
                    background: "rgba(34,197,94,0.02)",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 font-mono text-sm text-green-600">
                      {pre.resourceType && RESOURCE_ICONS[pre.resourceType as keyof typeof RESOURCE_ICONS] 
                        ? RESOURCE_ICONS[pre.resourceType as keyof typeof RESOURCE_ICONS] 
                        : "◉"}
                    </span>
                    <div>
                      <p className="font-mono text-xs font-semibold text-green-400">
                        {pre.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
                        {pre.description}
                      </p>
                      <span className="mt-1 inline-block font-mono text-[10px] uppercase tracking-widest text-green-700">
                        {pre.resourceType}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Implementation Steps Timeline */}
        <div>
          <p className="terminal-label">// implementation steps</p>
          <div className="mt-3 space-y-1.5">
            {paper.steps.map((step, i) => {
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStep(i)}
                  className="group flex w-full items-start gap-3 rounded-sm p-3 text-left transition-all duration-200"
                  style={{
                    border: isActive
                      ? "1px solid rgba(34,197,94,0.5)"
                      : "1px solid rgba(34,197,94,0.08)",
                    background: isActive
                      ? "rgba(34,197,94,0.07)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 0 12px rgba(34,197,94,0.08)"
                      : "none",
                  }}
                >
                  {/* Step number / tick */}
                  <div
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center font-mono text-xs"
                    style={{
                      border: `1px solid ${
                        isDone
                          ? "rgba(34,197,94,0.6)"
                          : isActive
                          ? "#4ade80"
                          : "rgba(34,197,94,0.2)"
                      }`,
                      color: isDone ? "#4ade80" : isActive ? "#4ade80" : "#16a34a",
                      background: isDone
                        ? "rgba(34,197,94,0.1)"
                        : "transparent",
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>

                  <div className="min-w-0">
                    <p
                      className={`font-mono text-xs font-semibold leading-snug ${
                        isActive ? "text-green-400" : "text-gray-400 group-hover:text-green-500"
                      }`}
                    >
                      {step.title}
                    </p>
                    {isActive && (
                      <p className="mt-0.5 text-xs leading-relaxed text-gray-500 line-clamp-2">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   RIGHT PANEL — The Code Editor
   ══════════════════════════════════════════════════ */
function EditorPanel({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onPrev,
}: {
  step: ImplementationStep;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const [code, setCode] = useState(step.starterCode ?? "# Write your solution here\n");
  const [activeTab, setActiveTab] = useState<"code" | "hints">("code");
  const [revealedHints, setRevealedHints] = useState(0);
  const hints = Array.isArray(step.hints) ? (step.hints as string[]) : [];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Editor header bar */}
      <div
        className="flex shrink-0 items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(34,197,94,0.12)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-800" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
          </div>
          <p className="font-mono text-xs text-gray-500">
            step_{String(stepIndex + 1).padStart(2, "0")}.py
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          {["code", "hints"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "code" | "hints")}
              className="font-mono text-xs uppercase tracking-widest transition-colors"
              style={{
                color: activeTab === tab ? "#4ade80" : "#6b7280",
                borderBottom: activeTab === tab ? "1px solid #4ade80" : "1px solid transparent",
                paddingBottom: "2px",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Step title */}
      <div
        className="shrink-0 px-5 py-3"
        style={{
          borderBottom: "1px solid rgba(34,197,94,0.08)",
          background: "#030803",
        }}
      >
        <p className="terminal-label">
          step {stepIndex + 1} / {totalSteps}
        </p>
        <h3 className="mt-1 font-mono text-sm font-bold text-green-400">
          {step.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {step.description}
        </p>
      </div>

      {/* Main content — code or hints */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "code" ? (
          <CyberEditor
            value={code}
            onChange={(v) => setCode(v)}
            language="python"
          />
        ) : (
          <div className="h-full overflow-y-auto px-5 py-4 space-y-3">
            <p className="terminal-label">// progressive hints</p>
            <p className="text-xs text-gray-600">
              Reveal hints one by one. Try first before unlocking the next.
            </p>
            {hints.slice(0, revealedHints).map((hint, i) => (
              <div
                key={i}
                className="rounded-sm p-3"
                style={{
                  border: "1px solid rgba(34,197,94,0.15)",
                  background: "rgba(34,197,94,0.03)",
                }}
              >
                <p className="terminal-label mb-1">hint {i + 1}</p>
                <p className="text-xs leading-relaxed text-gray-400">{hint}</p>
              </div>
            ))}
            {revealedHints < hints.length && (
              <button
                className="btn-outline text-xs py-2 px-4"
                onClick={() => setRevealedHints((n) => n + 1)}
              >
                [ reveal hint {revealedHints + 1} ]
              </button>
            )}
            {revealedHints === hints.length && hints.length > 0 && (
              <p className="font-mono text-xs text-green-700">
                ✓ All hints revealed. Check the code tab.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div
        className="flex shrink-0 items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(34,197,94,0.12)" }}
      >
        <button
          className="btn-outline py-2 px-4 text-xs disabled:opacity-30"
          onClick={onPrev}
          disabled={stepIndex === 0}
        >
          [ ← prev ]
        </button>

        {/* Progress bar */}
        <div className="flex flex-col items-center gap-1">
          <div className="h-1 w-32 overflow-hidden rounded-full bg-green-950">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${((stepIndex + 1) / totalSteps) * 100}%`,
                boxShadow: "0 0 6px rgba(34,197,94,0.6)",
              }}
            />
          </div>
          <p className="font-mono text-[10px] text-gray-600">
            {stepIndex + 1} / {totalSteps} complete
          </p>
        </div>

        <button
          className="btn-primary py-2 px-4 text-xs disabled:opacity-30"
          onClick={onNext}
          disabled={stepIndex === totalSteps - 1}
        >
          [ next → ]
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   NEURAL WORKSPACE — Split Screen Container
   ══════════════════════════════════════════════════ */
export default function NeuralWorkspace({ paper }: Props) {
  const [activeStep, setActiveStep] = useState(0);

  if (!paper.steps.length) {
    return (
      <div className="relative z-10 flex flex-1 items-center justify-center p-12">
        <div className="card-surface rounded-sm p-8 text-center">
          <p className="terminal-label">// error</p>
          <p className="mt-3 text-gray-500">
            No implementation steps found for this paper.
          </p>
        </div>
      </div>
    );
  }

  const currentStep = paper.steps[activeStep]!;

  return (
    <div
      className="relative z-10 flex flex-1 overflow-hidden"
      style={{ height: "calc(100vh - 80px)" }}
    >
      {/* Top status bar */}
      <div
        className="absolute left-0 right-0 top-0 z-20 flex h-8 items-center justify-between px-4"
        style={{
          background: "rgba(5,10,5,0.95)",
          borderBottom: "1px solid rgba(34,197,94,0.12)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="status-dot online" />
          <span className="font-mono text-[11px] text-green-600 uppercase tracking-widest">
            neural interface · active
          </span>
        </div>
        <span className="font-mono text-[11px] text-gray-600 truncate max-w-xs">
          {paper.title}
        </span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-gray-600">
            {paper.prerequisites.length} prereqs · {paper.steps.length} steps
          </span>
        </div>
      </div>

      {/* Main split layout, offset by the status bar */}
      <div className="mt-8 flex flex-1 overflow-hidden">
        {/* ── Left: Breakdown ── */}
        <div className="w-[340px] min-w-[280px] shrink-0 overflow-hidden" style={{ background: "rgba(5,10,5,0.97)" }}>
          <BreakdownPanel
            paper={paper}
            activeStep={activeStep}
            onSelectStep={setActiveStep}
          />
        </div>

        {/* ── Right: Editor ── */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: "#000000" }}>
          <EditorPanel
            key={activeStep}
            step={currentStep}
            stepIndex={activeStep}
            totalSteps={paper.steps.length}
            onNext={() => setActiveStep((n) => Math.min(n + 1, paper.steps.length - 1))}
            onPrev={() => setActiveStep((n) => Math.max(n - 1, 0))}
          />
        </div>
      </div>
    </div>
  );
}
