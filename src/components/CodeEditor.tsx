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
  const [output, setOutput] = useState("// Run the sample tests to see output.");
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("// Running...");

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
      setOutput("// Run failed. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="card-surface flex flex-col gap-4 rounded-sm p-6">
      <div className="flex items-center justify-between">
        <h3 className="terminal-label">// python editor</h3>
        <button
          className="btn-primary"
          type="button"
          onClick={handleRun}
          disabled={isRunning}
        >
          {isRunning ? "[ running... ]" : "[ run tests ]"}
        </button>
      </div>
      <textarea
        className="min-h-[220px] w-full rounded-sm border border-green-900/40 bg-black/60 p-4 font-mono text-sm text-green-300 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
        value={code}
        onChange={(event) => setCode(event.target.value)}
        spellCheck={false}
      />
      <div className="rounded-sm border border-green-900/30 bg-black/50 p-4">
        <p className="terminal-label">// output</p>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-xs text-green-300">
          {output}
        </pre>
      </div>
    </div>
  );
}
