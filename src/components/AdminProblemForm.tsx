"use client";

import { useState } from "react";

type FormState = {
  status: "idle" | "saving" | "saved" | "error";
  message: string | null;
};

type TopicOption = {
  slug: string;
  title: string;
};

type AdminProblemFormProps = {
  topics: TopicOption[];
};

export default function AdminProblemForm({ topics }: AdminProblemFormProps) {
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "saving", message: null });

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      topicSlug: String(formData.get("topicSlug") ?? ""),
      summary: String(formData.get("summary") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      tags: String(formData.get("tags") ?? ""),
      prompt: String(formData.get("prompt") ?? ""),
      inputFormat: String(formData.get("inputFormat") ?? ""),
      outputFormat: String(formData.get("outputFormat") ?? ""),
      constraints: String(formData.get("constraints") ?? ""),
      starterCode: String(formData.get("starterCode") ?? ""),
    };

    try {
      const response = await fetch("/api/admin/problems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setState({
          status: "error",
          message: data.error ?? "Failed to create problem.",
        });
        return;
      }

      setState({ status: "saved", message: "Problem created." });
      event.currentTarget.reset();
    } catch (error) {
      setState({ status: "error", message: "Failed to create problem." });
    }
  };

  return (
    <form
      className="card-surface flex flex-col gap-4 rounded-3xl p-6"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Title</label>
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="title"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Slug</label>
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="slug"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Topic</label>
        <select
          className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          name="topicSlug"
          required
        >
          <option value="">Select a topic</option>
          {topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
              {topic.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Summary</label>
        <textarea
          className="mt-2 min-h-[80px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          name="summary"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-semibold">Difficulty</label>
          <select
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="difficulty"
            defaultValue="EASY"
          >
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-semibold">Tags (comma separated)</label>
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="tags"
            placeholder="optimization, metrics"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Prompt</label>
        <textarea
          className="mt-2 min-h-[120px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          name="prompt"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold">Input format</label>
          <textarea
            className="mt-2 min-h-[80px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="inputFormat"
            required
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Output format</label>
          <textarea
            className="mt-2 min-h-[80px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
            name="outputFormat"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Constraints (one per line)</label>
        <textarea
          className="mt-2 min-h-[80px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          name="constraints"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Starter code</label>
        <textarea
          className="mt-2 min-h-[160px] w-full rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm font-mono outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          name="starterCode"
        />
      </div>

      {state.message ? (
        <p
          className={`rounded-2xl px-3 py-2 text-sm ${
            state.status === "saved"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button className="btn-primary" type="submit" disabled={state.status === "saving"}>
        {state.status === "saving" ? "Saving..." : "Create problem"}
      </button>
    </form>
  );
}
