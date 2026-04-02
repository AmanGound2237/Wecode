import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST ?? "";
  const portValue = process.env.SMTP_PORT ?? "";
  const port = Number(portValue || 587);
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASS ?? "";
  const from = process.env.EMAIL_FROM ?? "";

  if (!host || !user || !pass || !from) {
    return null;
  }

  return { host, port, user, pass, from };
};

export const isEmailConfigured = () => Boolean(getSmtpConfig());

export const sendEmail = async ({ to, subject, html, text }: EmailPayload) => {
  const config = getSmtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured.");
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  await transporter.sendMail({
    from: config.from,
    to,
    subject,
    html,
    text,
  });
};
