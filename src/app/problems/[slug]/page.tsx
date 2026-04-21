import { notFound } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import TagPill from "@/components/TagPill";
import { getProblemDetail } from "@/lib/problems-db";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type ProblemDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

const difficultyStyles: Record<string, string> = {
  EASY:   "tag-easy",
  MEDIUM: "tag-medium",
  HARD:   "tag-hard",
};

export default async function ProblemDetail({ params }: ProblemDetailProps) {
  const resolvedParams = await params;
  const problem = await getProblemDetail(resolvedParams.slug);

  if (!problem) {
    notFound();
  }

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`tag-pill ${difficultyStyles[problem.difficulty] ?? "tag-easy"}`}>
            {problem.difficulty}
          </span>
          {problem.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <div>
          <h1 className="font-mono text-3xl font-bold text-green-400 glow-text sm:text-4xl">
            {problem.title}
          </h1>
          <div className="mt-3 max-w-3xl text-lg leading-relaxed text-gray-400">
            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {problem.summary}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Problem description panel */}
        <div className="card-surface flex flex-col gap-6 rounded-sm p-6">
          <section className="flex flex-col gap-3">
            <h2 className="terminal-label">// prompt</h2>
            <div className="text-sm leading-7 text-gray-300">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {problem.prompt}
              </ReactMarkdown>
            </div>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="terminal-label">// input format</h3>
              <p className="mt-2 text-sm text-gray-400">
                {problem.inputFormat}
              </p>
            </div>
            <div>
              <h3 className="terminal-label">// output format</h3>
              <p className="mt-2 text-sm text-gray-400">
                {problem.outputFormat}
              </p>
            </div>
          </section>
          <section>
            <h3 className="terminal-label">// constraints</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-400">
              {problem.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="terminal-label">// examples</h3>
            {problem.examples.length ? (
              <div className="mt-3 grid gap-4">
                {problem.examples.map((example, index) => (
                  <div
                    key={`${problem.slug}-example-${index}`}
                    className="border border-green-900/30 bg-black/40 p-4"
                  >
                    <p className="terminal-label">example {index + 1}</p>
                    <p className="mt-2 font-mono text-sm text-gray-300">
                      <span className="text-green-500">input:</span>{" "}
                      {example.input}
                    </p>
                    <p className="mt-1 font-mono text-sm text-gray-300">
                      <span className="text-green-500">output:</span>{" "}
                      {example.output}
                    </p>
                    {example.explanation ? (
                      <div className="mt-1 font-mono text-sm text-gray-400">
                        <span className="text-green-600">why:</span>{" "}
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {example.explanation}
                        </ReactMarkdown>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-gray-600">
                No examples yet. Add examples in the admin console.
              </p>
            )}
          </section>
        </div>

        <CodeEditor starterCode={problem.starterCode} slug={problem.slug} />
      </div>
    </div>
  );
}
