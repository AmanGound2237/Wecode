export type DifficultyLabel = "Easy" | "Medium" | "Hard";

export type ProblemExample = {
  input: string;
  output: string;
  explanation?: string | null;
};

export type ProblemListItem = {
  slug: string;
  title: string;
  summary: string;
  difficulty: DifficultyLabel;
  tags: string[];
};

export type ProblemDetail = ProblemListItem & {
  prompt: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  starterCode: string;
  examples: ProblemExample[];
};
