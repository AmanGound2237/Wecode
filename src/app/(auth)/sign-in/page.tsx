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
        <p className="terminal-label">// authenticate</p>
        <h1 className="mt-2 font-mono text-3xl font-bold text-green-400 glow-text">
          Sign in
        </h1>
        <p className="mt-2 text-gray-400">
          Access your AI practice history and saved solutions.
        </p>
      </div>

      <form
        className="card-surface flex flex-col gap-4 rounded-sm p-6"
        onSubmit={handleSubmit}
      >
        <label className="font-mono text-xs font-semibold uppercase tracking-widest text-green-600">
          Email
        </label>
        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="font-mono text-xs font-semibold uppercase tracking-widest text-green-600">
          Password
        </label>
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        {error ? (
          <p className="border border-red-900/50 bg-red-950/30 px-3 py-2 font-mono text-sm text-red-400">
            ⚠ {error}
          </p>
        ) : null}
        <Link className="font-mono text-xs text-green-600 hover:text-green-400" href="/forgot-password">
          forgot password?
        </Link>
        <button className="btn-primary mt-2" type="submit">
          {isSubmitting ? "[ authenticating... ]" : "[ sign in ]"}
        </button>
      </form>

      <p className="font-mono text-sm text-gray-500">
        New here?{" "}
        <Link href="/sign-up" className="text-green-500 hover:text-green-400">
          create an account
        </Link>
      </p>
    </div>
  );
}
