import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isEmailConfigured, sendEmail } from "@/lib/email";

const forgotSchema = z.object({
  email: z.string().email(),
});

type ForgotPayload = z.infer<typeof forgotSchema>;

export async function POST(request: Request) {
  const json = (await request.json()) as ForgotPayload;
  const parsed = forgotSchema.safeParse(json);

  if (!parsed.success) {
    return Response.json({ error: "Invalid email." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return Response.json({ ok: true });
  }

  const rawToken = crypto.randomBytes(24).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

  if (isEmailConfigured()) {
    const html = `
      <p>You requested a password reset.</p>
      <p>Use the link below to set a new password:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `;
    const text = `Reset your password: ${resetUrl}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your AICode Atlas password",
        html,
        text,
      });
    } catch (error) {
      console.error("Failed to send reset email", error);
    }

    return Response.json({ ok: true });
  }

  const isDev = process.env.NODE_ENV !== "production";
  return Response.json({ ok: true, devToken: isDev ? rawToken : null });
}
