import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";

const resetSchema = z.object({
  token: z.string().min(12),
  password: z.string().min(8).max(128),
});

type ResetPayload = z.infer<typeof resetSchema>;

export async function POST(request: Request) {
  const json = (await request.json()) as ResetPayload;
  const parsed = resetSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid reset request." }, { status: 400 });
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(parsed.data.token)
    .digest("hex");

  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return Response.json({ error: "Reset token expired." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.deleteMany({
    where: { userId: record.userId },
  });

  return Response.json({ ok: true });
}
