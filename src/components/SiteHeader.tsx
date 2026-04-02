import Link from "next/link";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function SiteHeader() {
  const session = await getSession();
  const isAdmin = isAdminEmail(session.user?.email);
  const displayName = session.user?.name ?? session.user?.email ?? "";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[#fdf8ef]/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-lg tracking-tight">
            Wecode
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <Link className="nav-link" href="/problems">
            Problems
          </Link>
          <Link className="nav-link" href="/learn">
            Learn
          </Link>
          <Link className="nav-link" href="/submissions">
            Submissions
          </Link>
          {isAdmin ? (
            <Link className="nav-link" href="/admin">
              Admin
            </Link>
          ) : null}
          {session.user ? (
            <div className="flex flex-wrap items-center gap-2">
              <Link className="nav-link" href="/profile">
                Profile
              </Link>
              <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2 py-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2a9d8f] text-xs font-semibold text-white">
                  {initials || "U"}
                </span>
                <span className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-[#b24a2e] sm:inline">
                  {displayName}
                </span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Link className="nav-link" href="/sign-in">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
