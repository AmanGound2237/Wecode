"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type FormState = {
  status: "idle" | "resetting" | "done" | "error";
  message: string | null;
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, setState] = useState<FormState>({
    status: "idle",
    message: null,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ status: "resetting", message: null });

    const formData = new FormData(event.currentTarget);
    const payload = {
      token,
      password: String(formData.get("password") ?? ""),
    };

    try {
      const response = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setState({
          status: "error",
          message: data.error ?? "Unable to reset password.",
        });
        return;
      }

      setState({
        status: "done",
        message: "Password updated. You can sign in now.",
      });
      event.currentTarget.reset();
    } catch (error) {
      setState({ status: "error", message: "Unable to reset password." });
    }
  };

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-16">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          New credentials
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Reset password</h1>
        <p className="mt-2 text-[#4b3f35]">
          Choose a new password for your account.
        </p>
      </div>

      <form
        className="card-surface flex flex-col gap-4 rounded-3xl p-6"
        onSubmit={handleSubmit}
      >
        <label className="text-sm font-semibold">New password</label>
        <input
          className="rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-[#2a9d8f] focus:ring-2 focus:ring-[#2a9d8f]/30"
          type="password"
          name="password"
          placeholder="At least 8 characters"
          required
        />
        {state.message ? (
          <p
            className={`rounded-2xl px-3 py-2 text-sm ${
              state.status === "done"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </p>
        ) : null}
        <button className="btn-primary mt-2" type="submit" disabled={state.status === "resetting"}>
          {state.status === "resetting" ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <p className="text-sm text-[#4b3f35]">
        Remembered your password? <Link href="/sign-in">Sign in</Link>
      </p>
      {!token ? (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Missing reset token. Return to the reset request page.
        </p>
      ) : null}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
