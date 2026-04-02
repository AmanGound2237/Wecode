import { getIronSession } from "iron-session";
import type { IronSession } from "iron-session";
import { cookies } from "next/headers";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type SessionData = {
  user?: SessionUser;
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD ?? "",
  cookieName: "aicode_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const getSession = async (): Promise<IronSession<SessionData>> => {
  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  if (!sessionOptions.password) {
    if (isBuild) {
      const stubSession = {
        user: undefined,
        save: async () => {},
        destroy: () => {},
        updateConfig: () => {},
      };

      return stubSession as unknown as IronSession<SessionData>;
    }

    throw new Error("SESSION_PASSWORD is not set.");
  }

  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
};
