import { z } from "zod";
import { runPython } from "@/lib/runner";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const runSchema = z.object({
  code: z.string().min(1).max(20000),
  slug: z.string().min(1),
});

type RunPayload = z.infer<typeof runSchema>;

export async function POST(request: Request) {
  const json = (await request.json()) as RunPayload;
  const parsed = runSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid run payload." }, { status: 400 });
  }

  try {
    const problem = await prisma.problem.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (!problem) {
      return Response.json({ error: "Problem not found." }, { status: 404 });
    }

    const result = await runPython(parsed.data.code);
    const output = result.output || "(no output)";
    const errorOutput = result.errorOutput;
    const status = result.timedOut
      ? "TIMEOUT"
      : result.ok
        ? "ACCEPTED"
        : "RUNTIME_ERROR";

    const session = await getSession();
    if (session.user) {
      await prisma.submission.create({
        data: {
          userId: session.user.id,
          problemId: problem.id,
          status,
          runtimeMs: result.durationMs,
          language: "python",
          code: parsed.data.code,
          output: [output, errorOutput].filter(Boolean).join("\n"),
        },
      });
    }

    return Response.json({
      status: result.ok ? "ok" : "error",
      output: [
        `Run for: ${parsed.data.slug}`,
        `Duration: ${result.durationMs}ms`,
        result.timedOut ? "Status: timed out" : "Status: completed",
        "---",
        output,
        errorOutput ? "---\nErrors:\n" + errorOutput : "",
      ]
        .filter(Boolean)
        .join("\n"),
      error: errorOutput,
      stderr: errorOutput,
    });
  } catch (error) {
    return Response.json(
      {
        status: "error",
        output:
          "Runner failed to start. Ensure Docker Desktop is running and the python:3.11-slim image can be pulled.",
      },
      { status: 500 }
    );
  }
}
