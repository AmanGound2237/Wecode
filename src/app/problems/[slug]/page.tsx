import { notFound } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import TagPill from "@/components/TagPill";
import { getProblemDetail } from "@/lib/problems-db";

type ProblemDetailProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

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
          <span className="rounded-full bg-black/10 px-3 py-1 text-xs font-semibold">
            {problem.difficulty}
          </span>
          {problem.tags.map((tag) => (
            <TagPill key={tag} label={tag} />
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {problem.title}
          </h1>
          <p className="mt-3 max-w-3xl text-lg text-[#4b3f35]">
            {problem.summary}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-surface flex flex-col gap-6 rounded-3xl p-6">
          <section className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold">Prompt</h2>
            <p className="text-sm leading-7 text-[#4b3f35]">
              {problem.prompt}
            </p>
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
                Input format
              </h3>
              <p className="mt-2 text-sm text-[#4b3f35]">
                {problem.inputFormat}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
                Output format
              </h3>
              <p className="mt-2 text-sm text-[#4b3f35]">
                {problem.outputFormat}
              </p>
            </div>
          </section>
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
              Constraints
            </h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-[#4b3f35]">
              {problem.constraints.map((constraint) => (
                <li key={constraint}>{constraint}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
              Examples
            </h3>
            {problem.examples.length ? (
              <div className="mt-3 grid gap-4">
                {problem.examples.map((example, index) => (
                  <div
                    key={`${problem.slug}-example-${index}`}
                    className="rounded-2xl border border-black/10 bg-white/70 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
                      Example {index + 1}
                    </p>
                    <p className="mt-2 text-sm text-[#4b3f35]">
                      <span className="font-semibold">Input:</span> {example.input}
                    </p>
                    <p className="mt-2 text-sm text-[#4b3f35]">
                      <span className="font-semibold">Output:</span> {example.output}
                    </p>
                    {example.explanation ? (
                      <p className="mt-2 text-sm text-[#4b3f35]">
                        <span className="font-semibold">Why:</span>{" "}
                        {example.explanation}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#4b3f35]">
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
