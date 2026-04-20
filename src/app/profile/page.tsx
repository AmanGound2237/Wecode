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
          <p className="terminal-label">// auth required</p>
          <h1 className="mt-2 font-mono text-3xl font-bold text-green-400 glow-text">
            Sign in to view profile
          </h1>
          <p className="mt-3 text-gray-400">
            Your learning stats and history live in your profile.
          </p>
        </div>
        <Link className="btn-primary w-fit" href="/sign-in">
          [ sign in ]
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
      {/* Header */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center bg-green-500 font-mono text-xl font-bold text-black">
            {initials || "U"}
          </div>
          <div>
            <p className="terminal-label">// profile</p>
            <h1 className="mt-1 font-mono text-3xl font-bold text-green-400 glow-text">
              {displayName}
            </h1>
            <p className="mt-1 font-mono text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface rounded-sm p-6">
          <p className="terminal-label">// solved</p>
          <p className="mt-4 font-mono text-4xl font-bold text-green-400 glow-text">
            {solvedCount}
          </p>
          <p className="mt-2 text-sm text-gray-500">problems solved</p>
        </div>
        <div className="card-surface rounded-sm p-6">
          <p className="terminal-label">// consistency</p>
          <p className="mt-4 font-mono text-4xl font-bold text-green-400 glow-text">
            {activeDays.size}
          </p>
          <p className="mt-2 text-sm text-gray-500">active days this month</p>
        </div>
        <div className="card-surface rounded-sm p-6">
          <p className="terminal-label">// difficulty mix</p>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between border-b border-green-900/20 pb-2">
              <span className="tag-easy font-mono text-xs uppercase tracking-wider">
                easy
              </span>
              <span className="font-mono font-bold text-gray-300">
                {difficultyCounts.Easy}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-green-900/20 pb-2">
              <span className="tag-medium font-mono text-xs uppercase tracking-wider">
                medium
              </span>
              <span className="font-mono font-bold text-gray-300">
                {difficultyCounts.Medium}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="tag-hard font-mono text-xs uppercase tracking-wider">
                hard
              </span>
              <span className="font-mono font-bold text-gray-300">
                {difficultyCounts.Hard}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Topics + recent */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card-surface rounded-sm p-6">
          <h2 className="font-mono text-xl font-bold text-green-400">
            Solved topics
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Your top focus areas based on accepted submissions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.length ? (
              topTags.map(([tag, count]) => (
                <TagPill key={tag} label={`${tag} (${count})`} />
              ))
            ) : (
              <p className="text-sm text-gray-600">
                Solve a problem to see topic stats.
              </p>
            )}
          </div>
        </div>

        <div className="card-surface rounded-sm p-6">
          <h2 className="font-mono text-xl font-bold text-green-400">
            Recent accepted
          </h2>
          <div className="mt-4 grid gap-3">
            {acceptedSubmissions.slice(0, 6).map((submission) => (
              <div
                key={submission.id}
                className="border border-green-900/30 bg-black/40 p-3"
              >
                <p className="font-mono text-sm font-semibold text-gray-300">
                  {submission.problem.title}
                </p>
                <p className="mt-1 font-mono text-xs text-gray-600">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
            ))}
            {!acceptedSubmissions.length ? (
              <p className="text-sm text-gray-600">
                No accepted runs yet. Solve a problem to populate this list.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
