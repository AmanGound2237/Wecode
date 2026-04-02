import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  ACCEPTED: "text-[#2a9d8f]",
  WRONG_ANSWER: "text-[#b24a2e]",
  RUNTIME_ERROR: "text-[#b24a2e]",
  TIMEOUT: "text-[#b24a2e]",
  PENDING: "text-[#4b3f35]",
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export default async function SubmissionsPage() {
  const session = await getSession();

  if (!session.user) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
            Auth required
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in to view submissions</h1>
          <p className="mt-3 text-[#4b3f35]">
            Your submission history is tied to your account.
          </p>
        </div>
        <Link className="btn-primary w-fit" href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  const submissions = await prisma.submission.findMany({
    where: { userId: session.user.id },
    include: { problem: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          History
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Recent submissions</h1>
        <p className="mt-3 text-[#4b3f35]">
          Track your Python runs and review outputs. This view will connect to
          your database once auth is enabled.
        </p>
      </div>

      <div className="card-surface rounded-3xl p-6">
        {submissions.length ? (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white/70 p-4"
              >
                <div>
                  <p className="text-base font-semibold">
                    {submission.problem.title}
                  </p>
                  <p className="text-sm text-[#4b3f35]">
                    {submission.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className={statusStyles[submission.status]}>
                    {formatStatus(submission.status)}
                  </span>
                  <span className="text-[#4b3f35]">
                    {submission.runtimeMs ? `${submission.runtimeMs} ms` : "--"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#4b3f35]">
            No submissions yet. Run a problem to see it here.
          </p>
        )}
      </div>
    </div>
  );
}
