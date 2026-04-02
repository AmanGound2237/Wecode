import { prisma } from "@/lib/db";
import type {
  DifficultyLabel,
  ProblemDetail,
  ProblemExample,
  ProblemListItem,
} from "@/lib/problem-types";

const mapDifficulty = (value: string): DifficultyLabel => {
  switch (value) {
    case "EASY":
      return "Easy";
    case "MEDIUM":
      return "Medium";
    case "HARD":
      return "Hard";
    default:
      return "Easy";
  }
};

const mapTags = (tags: Array<{ tag: { name: string } }>) =>
  tags.map((entry) => entry.tag.name);

export const getProblemList = async (): Promise<ProblemListItem[]> => {
  const items = await prisma.problem.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      topic: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  return items.map((problem) => {
    const tagSet = new Set([problem.topic?.slug ?? "general", ...mapTags(problem.tags)]);
    const tags = Array.from(tagSet);

    return {
    slug: problem.slug,
    title: problem.title,
    summary: problem.summary,
    difficulty: mapDifficulty(problem.difficulty),
    tags,
    };
  });
};

export const getAllTags = async (): Promise<string[]> => {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return tags.map((tag) => tag.name);
};

export const getProblemDetail = async (
  slug: string
): Promise<ProblemDetail | null> => {
  const problem = await prisma.problem.findUnique({
    where: { slug },
    include: {
      topic: true,
      tags: {
        include: { tag: true },
      },
      examples: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!problem) {
    return null;
  }

  const examples: ProblemExample[] = problem.examples.map((example) => ({
    input: example.input,
    output: example.output,
    explanation: example.explanation,
  }));

  const tagSet = new Set([problem.topic?.slug ?? "general", ...mapTags(problem.tags)]);

  return {
    slug: problem.slug,
    title: problem.title,
    summary: problem.summary,
    difficulty: mapDifficulty(problem.difficulty),
    tags: Array.from(tagSet),
    prompt: problem.prompt,
    inputFormat: problem.inputFormat,
    outputFormat: problem.outputFormat,
    constraints: problem.constraints,
    starterCode: problem.starterCode,
    examples,
  };
};
