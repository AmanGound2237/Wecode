import Link from "next/link";
import AdminProblemForm from "@/components/AdminProblemForm";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session.user) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
            Auth required
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in to continue</h1>
          <p className="mt-3 text-[#4b3f35]">
            Admin access is limited to approved accounts.
          </p>
        </div>
        <Link className="btn-primary w-fit" href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  if (!isAdminEmail(session.user.email)) {
    return (
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#b24a2e]">
            Access denied
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Not an admin</h1>
          <p className="mt-3 text-[#4b3f35]">
            Add your email to ADMIN_EMAILS in .env to enable admin access.
          </p>
        </div>
        <Link className="btn-outline w-fit" href="/">
          Back to home
        </Link>
      </div>
    );
  }

  const topics = await prisma.topic.findMany({
    orderBy: { title: "asc" },
    select: { slug: true, title: true },
  });

  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2a9d8f]">
          Admin console
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Create a new problem</h1>
        <p className="mt-3 text-[#4b3f35]">
          Use this form to add new AI practice challenges to the database.
        </p>
      </div>

      <AdminProblemForm topics={topics} />
    </div>
  );
}
