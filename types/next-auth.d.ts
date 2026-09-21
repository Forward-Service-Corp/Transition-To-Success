import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      level?: string;
      phone?: string;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    level?: string;
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      _id: string;
      level?: string;
      phone?: string;

      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accountType?: string;
  }
}
