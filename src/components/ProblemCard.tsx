import Link from "next/link";
import type { ProblemListItem } from "@/lib/problem-types";
import TagPill from "@/components/TagPill";

const difficultyStyles: Record<ProblemListItem["difficulty"], string> = {
  Easy: "bg-[#2a9d8f]/15 text-[#1c7f73]",
  Medium: "bg-[#f4a261]/20 text-[#a8552c]",
  Hard: "bg-[#9b2226]/15 text-[#7f1d1d]",
};

type ProblemCardProps = {
  problem: ProblemListItem;
};

export default function ProblemCard({ problem }: ProblemCardProps) {
  return (
    <Link
      href={`/problems/${problem.slug}`}
      className="card-surface flex h-full flex-col gap-4 rounded-3xl p-6 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            difficultyStyles[problem.difficulty]
          }`}
        >
          {problem.difficulty}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b24a2e]">
          {problem.tags[0] ?? "ai"}
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold">{problem.title}</h3>
        <p className="mt-2 text-sm text-[#4b3f35]">{problem.summary}</p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {problem.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </div>
    </Link>
  );
}
