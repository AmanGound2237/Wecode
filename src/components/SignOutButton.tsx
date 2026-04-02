"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SignOutButtonProps = {
  label?: string;
};

export default function SignOutButton({ label = "Sign out" }: SignOutButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignOut = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      className="nav-link"
      type="button"
      onClick={handleSignOut}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Signing out..." : label}
    </button>
  );
}
