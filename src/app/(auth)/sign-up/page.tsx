"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setError(data.error ?? "Unable to create account.");
        return;
      }

      router.push("/problems");
    } catch (fetchError) {
      setError("Unable to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
          Join the arena
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-[#4b3f35]">
          Track progress, save solutions, and compare performance.
        </p>
      </div>

      <form
        className="card-surface flex flex-col gap-4 rounded-3xl p-6"
        onSubmit={handleSubmit}
      >
        <label className="text-sm font-semibold">Name</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          type="text"
          name="name"
          placeholder="Ada Lovelace"
          required
        />
        <label className="text-sm font-semibold">Email</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          type="email"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-sm font-semibold">Password</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
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
        <button className="btn-primary mt-2" type="submit">
          {isSubmitting ? "Creating..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-[#4b3f35]">
        Already have an account? <Link href="/sign-in">Sign in</Link>
      </p>
    </div>
  );
}
