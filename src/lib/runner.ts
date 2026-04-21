export type RunnerResult = {
  ok: boolean;
  output: string;
  errorOutput: string;
  durationMs: number;
  timedOut: boolean;
};

const WANDBOX_API_URL = "https://wandbox.org/api/compile.json";
// Using pypy-3.10 as it's a stable, modern Python 3.x environment on Wandbox
const WANDBOX_COMPILER = "pypy-3.10-v7.3.17";

export const runPython = async (code: string): Promise<RunnerResult> => {
  const start = Date.now();

  try {
    const response = await fetch(WANDBOX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler: WANDBOX_COMPILER,
        code: code,
        save: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Wandbox API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Wandbox status "0" usually means success
    const isOk = data.status === "0";
    
    return {
      ok: isOk,
      output: (data.program_output || "").trim(),
      errorOutput: (data.program_error || "").trim(),
      durationMs: Date.now() - start,
      timedOut: false, // Wandbox has its own timeout limits
    };
  } catch (error: any) {
    console.error("Wandbox Execution Error:", error);
    return {
      ok: false,
      output: "",
      errorOutput: error.message || "Execution failed",
      durationMs: Date.now() - start,
      timedOut: false,
    };
  }
};
