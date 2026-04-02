"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to sign in.");
        return;
      }

      router.push("/problems");
    } catch (fetchError) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
        <p className="mt-2 text-[#4b3f35]">
          Access your AI practice history and saved solutions.
        </p>
      </div>

      <form
        className="card-surface flex flex-col gap-4 rounded-3xl p-6"
        onSubmit={handleSubmit}
      >
        <label className="text-sm font-semibold">Email</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/30"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-sm font-semibold">Password</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#e76f51] focus:ring-2 focus:ring-[#e76f51]/30"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <Link className="text-xs text-[#2a9d8f]" href="/forgot-password">
          Forgot password?
        </Link>
        <button className="btn-primary mt-2" type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-[#4b3f35]">
        New here? <Link href="/sign-up">Create an account</Link>
      </p>
    </div>
  );
}
