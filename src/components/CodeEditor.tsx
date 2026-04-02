"use client";

import { useState } from "react";

type CodeEditorProps = {
  starterCode: string;
  slug: string;
};

type RunResponse = {
  status: "ok" | "error";
  output: string;
};

export default function CodeEditor({ starterCode, slug }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run the sample tests to see output.");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running...");

    try {
      const response = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, slug }),
      });

      const data = (await response.json()) as RunResponse;
      setOutput(data.output);
    } catch (error) {
      setOutput("Run failed. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="card-surface flex flex-col gap-4 rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Python editor</h3>
        <button
          className="btn-primary"
          type="button"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run sample tests"}
        </button>
      </div>
      <textarea
        className="min-h-[220px] w-full rounded-2xl border border-black/10 bg-white/70 p-4 font-mono text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <div className="rounded-2xl border border-black/10 bg-white/60 p-4 font-mono text-xs">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          Output
        </p>
        <pre className="mt-3 whitespace-pre-wrap text-[#4b3f35]">
          {output}
        </pre>
      </div>
    </div>
  );
}
