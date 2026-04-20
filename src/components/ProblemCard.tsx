import Link from "next/link";
import type { ProblemListItem } from "@/lib/problem-types";
import TagPill from "@/components/TagPill";

const difficultyStyles: Record<ProblemListItem["difficulty"], string> = {
  Easy:   "tag-easy",
  Medium: "tag-medium",
  Hard:   "tag-hard",
};

type ProblemCardProps = {
  problem: ProblemListItem;
};

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="card-surface flex h-full flex-col gap-4 rounded-sm p-6 transition-all duration-200 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span className={`tag-pill ${difficultyStyles[problem.difficulty]}`}>
          {problem.difficulty}
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-green-600">
          {problem.tags[0] ?? "ai"}
        </span>
      </div>
      <div>
        <h3 className="font-mono text-lg font-semibold text-green-400">
          {problem.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">
          {problem.summary}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
    </Link>
  );
}
