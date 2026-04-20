import Link from "next/link";
import ProblemCard from "@/components/ProblemCard";
import { getProblemList } from "@/lib/problems-db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featured = (await getProblemList()).slice(0, 3);

  return (
    <div className="relative z-10 flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-12 pt-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Hero copy */}
          <div className="flex flex-col gap-6">
            <p className="terminal-label">// ai practice arena</p>
            <h1 className="font-mono text-4xl font-bold leading-tight text-green-400 glow-text sm:text-5xl">
              Train for real AI interviews
              <span className="typing-cursor" />
            </h1>
            <p className="text-lg leading-relaxed text-gray-400">
              Hack ML, DL, and data-centric challenges. Run Python code, track
              your progress, and implement research papers from scratch.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/problems">
                [ explore problems ]
              </Link>
              <Link className="btn-outline" href="/sign-up">
                [ create account ]
              </Link>
            </div>
          </div>

          {/* Stats card */}
          <div className="card-surface rounded-sm p-6">
            <p className="terminal-label">// this week</p>
            <h2 className="mt-4 font-mono text-2xl font-bold text-green-400">
              120 challenges
            </h2>
            <p className="mt-1 text-sm text-gray-500">across 14 tracks</p>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="border border-green-900/30 bg-black/40 p-4">
                <p className="font-mono font-semibold text-green-300">
                  Model evaluation
                </p>
                <p className="mt-1 text-gray-500">
                  Metrics, confusion matrices, calibration.
                </p>
              </div>
              <div className="border border-green-900/30 bg-black/40 p-4">
                <p className="font-mono font-semibold text-green-300">
                  Deep learning drills
                </p>
                <p className="mt-1 text-gray-500">
                  Backprop, optimizers, gradient checks.
                </p>
              </div>
              <div className="border border-green-900/30 bg-black/40 p-4">
                <p className="font-mono font-semibold text-green-300">
                  Code with AI
                </p>
                <p className="mt-1 text-gray-500">
                  Implement research papers step-by-step.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured problems */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="terminal-label">// featured</p>
            <h2 className="mt-2 font-mono text-2xl font-bold text-green-400">
              New AI problems
            </h2>
          </div>
          <Link className="btn-outline py-2 px-4 text-xs" href="/problems">
            [ view all ]
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.length ? (
            featured.map((problem) => (
              <ProblemCard key={problem.slug} problem={problem} />
            ))
          ) : (
            <div className="card-surface rounded-sm p-6 text-sm text-gray-500">
              No problems yet. Add your first problem in the admin console.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
