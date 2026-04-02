"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = {
  status: "idle" | "sending" | "sent" | "error";
  message: string | null;
  devToken?: string | null;
};

export default function ForgotPasswordPage() {
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: null,
    devToken: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "sending", message: null, devToken: null });

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        error?: string;
        devToken?: string | null;
      };
      if (!response.ok) {
        setState({
          status: "error",
          message: data.error ?? "Unable to send reset email.",
          devToken: null,
        });
        return;
      }

      setState({
        status: "sent",
        message: "If an account exists, a reset link is on the way.",
        devToken: data.devToken ?? null,
      });
      event.currentTarget.reset();
    } catch (error) {
      setState({
        status: "error",
        message: "Unable to send reset email.",
        devToken: null,
      });
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
          Password reset
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-[#4b3f35]">
          Enter your email and we will send a reset link.
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
        {state.message ? (
          <p
            className={`rounded-2xl px-3 py-2 text-sm ${
              state.status === "sent"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        {state.devToken ? (
          <div className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-xs">
            <p className="font-semibold text-[#2a9d8f]">Dev token</p>
            <p className="break-all text-[#4b3f35]">{state.devToken}</p>
            <Link className="mt-2 inline-flex text-[#2a9d8f]" href={`/reset-password?token=${state.devToken}`}>
              Continue to reset
            </Link>
          </div>
        ) : null}
        <button className="btn-primary mt-2" type="submit" disabled={state.status === "sending"}>
          {state.status === "sending" ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-sm text-[#4b3f35]">
        Remembered your password? <Link href="/sign-in">Sign in</Link>
      </p>
    </div>
  );
}
