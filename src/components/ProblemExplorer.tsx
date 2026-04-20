"use client";

import { useMemo, useState } from "react";
import type { ProblemListItem } from "@/lib/problem-types";
import ProblemCard from "@/components/ProblemCard";
import TagPill from "@/components/TagPill";

const difficulties: Array<"All" | ProblemListItem["difficulty"]> = [
  "All",
  "Easy",
  "Medium",
  "Hard",
];

type ProblemExplorerProps = {
  problems: ProblemListItem[];
  tags: string[];
};

export default function ProblemExplorer({ problems, tags }: ProblemExplorerProps) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<
    "All" | ProblemListItem["difficulty"]
  >("All");
  const [tag, setTag] = useState("All");

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const matchesQuery = problem.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;
      const matchesTag = tag === "All" || problem.tags.includes(tag);
      return matchesQuery && matchesDifficulty && matchesTag;
    });
  }, [difficulty, problems, query, tag]);

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-4">
        <p className="terminal-label">// problem library</p>
        <h1 className="font-mono text-3xl font-bold text-green-400 glow-text sm:text-4xl">
          Explore AI practice problems
        </h1>
        <p className="max-w-2xl text-gray-400">
          Filter by topic, difficulty, or search for a concept. Every problem
          ships with Python starter code and structured test expectations.
        </p>
      </div>

      <div className="card-surface grid gap-4 rounded-sm p-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-3">
          <label className="terminal-label">// search</label>
          <input
            className="input-field w-full"
            placeholder="Search by keyword, like 'metrics' or 'attention'"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="terminal-label">// difficulty</label>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((level) => (
              <TagPill
                key={level}
                label={level}
                active={difficulty === level}
                onClick={() => setDifficulty(level)}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-2">
          <label className="terminal-label">// topics</label>
          <div className="flex flex-wrap gap-2">
            <TagPill
              label="All"
              active={tag === "All"}
              onClick={() => setTag("All")}
            />
            {tags.map((topic) => (
              <TagPill
                key={topic}
                label={topic}
                active={tag === topic}
                onClick={() => setTag(topic)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length ? (
          filtered.map((problem) => (
            <ProblemCard key={problem.slug} problem={problem} />
          ))
        ) : (
          <div className="card-surface rounded-sm p-6 text-sm text-gray-500">
            No problems found. Add new challenges in the admin console.
          </div>
        )}
      </div>
    </div>
  );
}
