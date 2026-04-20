/**
 * ════════════════════════════════════════════════════════
 * Code with AI — Type Definitions
 * TypeScript interfaces for the research paper learning pipeline.
 * ════════════════════════════════════════════════════════
 */

// ── Gemini API Configuration ──

export interface GeminiConfig {
  apiKey: string;
  model: string;           // e.g. "gemini-2.5-pro"
  maxOutputTokens: number;
  temperature: number;
}

// ── Paper Analysis (raw output from Gemini) ──

export interface PaperAnalysis {
  title: string;
  authors: string[];
  abstract: string;
  coreConcepts: string[];
  methodology: string;
  keyContributions: string[];
  mathematicalFoundations: string[];
  implementationComplexity: "beginner" | "intermediate" | "advanced";
  estimatedSteps: number;
}

// ── Prerequisites Engine ──

export interface PrerequisiteData {
  title: string;
  description: string;
  resourceUrl: string | null;
  resourceType: "video" | "article" | "documentation" | "course" | "paper";
  estimatedMinutes: number;
}

// ── Progressive Breakdown — Implementation Steps ──

export interface StepData {
  title: string;
  description: string;
  hints: string[];
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
  order: number;
  conceptsCovered: string[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

// ── Real-World Synthesis ──

export interface SynthesisData {
  whySummary: string;
  industryUses: IndustryUseCase[];
  keyTakeaways: string[];
  furtherReading: FurtherReadingItem[];
}

export interface IndustryUseCase {
  company: string;
  useCase: string;
  description: string;
}

export interface FurtherReadingItem {
  title: string;
  url: string;
}

// ── Pipeline Orchestration ──

export type PipelineStage =
  | "idle"
  | "uploading"
  | "extracting"
  | "analyzing"
  | "generating_prerequisites"
  | "generating_steps"
  | "generating_synthesis"
  | "ready"
  | "error";

export interface PaperPipeline {
  paperId: string;
  stage: PipelineStage;
  progress: number;       // 0–100
  error: string | null;
  analysis: PaperAnalysis | null;
  prerequisites: PrerequisiteData[];
  steps: StepData[];
  synthesis: SynthesisData | null;
}

// ── API Response Wrappers ──

export interface PaperApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}
