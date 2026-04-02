export const isAdminEmail = (email?: string | null) => {
  if (!email) {
    return false;
  }

  const envList = process.env.ADMIN_EMAILS ?? "";
  const allowed = envList
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  return allowed.includes(email.toLowerCase());
};
