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
    <header className="sticky top-0 z-30 border-b border-green-900/30 bg-black/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-lg font-bold tracking-tight text-green-400 glow-text-sm"
          >
            &gt; wecode_
          </Link>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link className="nav-link" href="/problems">
            problems
          </Link>
          <Link className="nav-link" href="/uplink">
            code&nbsp;with&nbsp;ai
          </Link>
          <Link className="nav-link" href="/learn">
            learn
          </Link>
          <Link className="nav-link" href="/submissions">
            submissions
          </Link>
          {isAdmin ? (
            <Link className="nav-link" href="/admin">
              admin
            </Link>
          ) : null}
          {session.user ? (
            <div className="flex flex-wrap items-center gap-3">
              <Link className="nav-link" href="/profile">
                profile
              </Link>
              {/* Avatar chip */}
              <div className="flex items-center gap-2 border border-green-900/40 bg-green-950/30 px-2 py-1">
                <span className="flex h-6 w-6 items-center justify-center bg-green-500 font-mono text-xs font-bold text-black">
                  {initials || "U"}
                </span>
                <span className="hidden font-mono text-xs font-semibold uppercase tracking-[0.15em] text-green-500 sm:inline">
                  {displayName}
                </span>
              </div>
              <SignOutButton />
            </div>
          ) : (
            <Link className="btn-primary py-2 px-4 text-xs" href="/sign-in">
              [ sign in ]
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
