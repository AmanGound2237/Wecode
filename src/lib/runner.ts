import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type RunnerResult = {
  ok: boolean;
  output: string;
  errorOutput: string;
  durationMs: number;
  timedOut: boolean;
};

const DEFAULT_TIMEOUT_MS = 3000;

const runPythonLocally = async (code: string): Promise<RunnerResult> => {
  const timeoutMs = Number(process.env.RUNNER_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "aicode-"));
  const filePath = path.join(tempDir, "main.py");
  const start = Date.now();
  const pythonCmd = process.env.RUNNER_PYTHON_CMD ?? "python3";

  try {
    await writeFile(filePath, code, "utf8");

    const child = spawn(pythonCmd, [filePath], { stdio: "pipe" });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    const exitCode = await new Promise<number>((resolve) => {
      child.on("close", (code) => resolve(code ?? 1));
      child.on("error", () => resolve(1));
    });

    clearTimeout(timeout);

    return {
      ok: exitCode === 0 && !timedOut,
      output: stdout.trim(),
      errorOutput: stderr.trim(),
      durationMs: Date.now() - start,
      timedOut,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

const runPythonInDocker = async (code: string): Promise<RunnerResult> => {
  const timeoutMs = Number(process.env.RUNNER_TIMEOUT_MS ?? DEFAULT_TIMEOUT_MS);
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "aicode-"));
  const filePath = path.join(tempDir, "main.py");
  const start = Date.now();

  try {
    await writeFile(filePath, code, "utf8");

    const dockerArgs = [
      "run",
      "--rm",
      "--network",
      "none",
      "--memory",
      "256m",
      "--cpus",
      "0.5",
      "--pids-limit",
      "64",
      "-v",
      `${tempDir}:/workspace`,
      "-w",
      "/workspace",
      "python:3.11-slim",
      "python",
      "main.py",
    ];

    const child = spawn("docker", dockerArgs, { stdio: "pipe" });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    const exitCode = await new Promise<number>((resolve) => {
      child.on("close", (code) => resolve(code ?? 1));
      child.on("error", () => resolve(1));
    });

    clearTimeout(timeout);

    return {
      ok: exitCode === 0 && !timedOut,
      output: stdout.trim(),
      errorOutput: stderr.trim(),
      durationMs: Date.now() - start,
      timedOut,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
};

export const runPython = async (code: string): Promise<RunnerResult> => {
  const mode = process.env.RUNNER_MODE ?? "docker";
  if (mode === "local") {
    return runPythonLocally(code);
  }

  return runPythonInDocker(code);
};
