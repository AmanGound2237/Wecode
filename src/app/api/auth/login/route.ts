import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

type LoginPayload = z.infer<typeof loginSchema>;

export async function POST(request: Request) {
  const json = (await request.json()) as LoginPayload;
  const parsed = loginSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid login details." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const session = await getSession();
  session.user = { id: user.id, email: user.email, name: user.name };
  await session.save();

  return Response.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
}
