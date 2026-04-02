import Link from "next/link";
import TagPill from "@/components/TagPill";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default async function ProfilePage() {
  const session = await getSession();

  if (!session.user) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
            Auth required
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in to view profile</h1>
          <p className="mt-3 text-[#4b3f35]">
            Your learning stats and history live in your profile.
          </p>
        </div>
        <Link className="btn-primary w-fit" href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, createdAt: true },
  });

  const acceptedSubmissions = await prisma.submission.findMany({
    where: { userId: session.user.id, status: "ACCEPTED" },
    include: {
      problem: {
        include: {
          tags: {
            include: { tag: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const solvedByProblem = new Map<string, typeof acceptedSubmissions[number]>();
  acceptedSubmissions.forEach((submission) => {
    if (!solvedByProblem.has(submission.problemId)) {
      solvedByProblem.set(submission.problemId, submission);
    }
  });

  const solvedCount = solvedByProblem.size;
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  const tagCounts = new Map<string, number>();

  solvedByProblem.forEach((submission) => {
    const difficulty = submission.problem.difficulty;
    if (difficulty === "EASY") {
      difficultyCounts.Easy += 1;
    } else if (difficulty === "MEDIUM") {
      difficultyCounts.Medium += 1;
    } else {
      difficultyCounts.Hard += 1;
    }

    submission.problem.tags.forEach((tag) => {
      const name = tag.tag.name;
      tagCounts.set(name, (tagCounts.get(name) ?? 0) + 1);
    });
  });

  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const monthlySubmissions = await prisma.submission.findMany({
    where: {
      userId: session.user.id,
      createdAt: { gte: startOfMonth, lt: nextMonth },
    },
    select: { createdAt: true },
  });

  const activeDays = new Set(
    monthlySubmissions.map((submission) =>
      submission.createdAt.toISOString().slice(0, 10)
    )
  );

  const displayName = user?.name ?? user?.email ?? "User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a9d8f] text-xl font-semibold text-white">
            {initials || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
              Profile
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{displayName}</h1>
            <p className="mt-2 text-sm text-[#4b3f35]">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
            Solved
          </p>
          <p className="mt-4 text-3xl font-semibold">{solvedCount}</p>
          <p className="mt-2 text-sm text-[#4b3f35]">Problems solved</p>
        </div>
        <div className="card-surface rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
            Consistency
          </p>
          <p className="mt-4 text-3xl font-semibold">{activeDays.size}</p>
          <p className="mt-2 text-sm text-[#4b3f35]">Active days this month</p>
        </div>
        <div className="card-surface rounded-3xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
            Difficulty mix
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-[#4b3f35]">
            <div className="flex items-center justify-between">
              <span>Easy</span>
              <span className="font-semibold">{difficultyCounts.Easy}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Medium</span>
              <span className="font-semibold">{difficultyCounts.Medium}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Hard</span>
              <span className="font-semibold">{difficultyCounts.Hard}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Solved topics</h2>
          <p className="mt-2 text-sm text-[#4b3f35]">
            Your top focus areas based on accepted submissions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.length ? (
              topTags.map(([tag, count]) => (
                <TagPill key={tag} label={`${tag} (${count})`} />
              ))
            ) : (
              <p className="text-sm text-[#4b3f35]">
                Solve a problem to see topic stats.
              </p>
            )}
          </div>
        </div>

        <div className="card-surface rounded-3xl p-6">
          <h2 className="text-xl font-semibold">Recent accepted</h2>
          <div className="mt-4 grid gap-3">
            {acceptedSubmissions.slice(0, 6).map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl border border-black/10 bg-white/70 p-4"
              >
                <p className="text-sm font-semibold">
                  {submission.problem.title}
                </p>
                <p className="mt-1 text-xs text-[#4b3f35]">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
            ))}
            {!acceptedSubmissions.length ? (
              <p className="text-sm text-[#4b3f35]">
                No accepted runs yet. Solve a problem to populate this list.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
