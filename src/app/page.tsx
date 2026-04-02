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
          <div className="flex flex-col gap-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
              AI practice arena
            </p>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl">
              Train for real AI interviews with curated ML, DL, and
              data-centric challenges.
            </h1>
            <p className="text-lg text-[#4b3f35]">
              Solve focused AI problems, run Python code, and track your
              progress. From classic algorithms to model evaluation and
              optimization, it is all in one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="/problems">
                Explore problems
              </Link>
              <Link className="btn-outline" href="/sign-up">
                Create account
              </Link>
            </div>
          </div>
          <div className="card-surface rounded-3xl p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
              This week
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              120 AI challenges across 14 tracks
            </h2>
            <div className="mt-6 grid gap-4 text-sm">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="font-semibold">Model evaluation</p>
                <p className="text-[#4b3f35]">
                  Metrics, confusion matrices, and calibration.
                </p>
              </div>
              <div className="rounded-2xl border border-black/10 bg-white/70 p-4">
                <p className="font-semibold">Deep learning drills</p>
                <p className="text-[#4b3f35]">
                  Backprop, optimizers, and gradient checks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
              Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold">New AI problems</h2>
          </div>
          <Link className="btn-outline" href="/problems">
            View all
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {featured.length ? (
            featured.map((problem) => (
              <ProblemCard key={problem.slug} problem={problem} />
            ))
          ) : (
            <div className="card-surface rounded-3xl p-6 text-sm text-[#4b3f35]">
              No problems yet. Add your first problem in the admin console.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
