import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  await session.destroy();
  return Response.json({ ok: true });
}
