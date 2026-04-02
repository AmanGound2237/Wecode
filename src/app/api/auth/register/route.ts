import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

const registerSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

type RegisterPayload = z.infer<typeof registerSchema>;

export async function POST(request: Request) {
  const json = (await request.json()) as RegisterPayload;
  const parsed = registerSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid registration details." },
      { status: 400 }
    );
  }

  const email = parsed.data.email.toLowerCase().trim();
  const name = parsed.data.name?.trim() || null;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: "Email already in use." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  const session = await getSession();
  session.user = { id: user.id, email: user.email, name: user.name };
  await session.save();

  return Response.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
}
