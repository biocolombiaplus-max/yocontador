import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      cedula: string;
      role: string;
      mustChangePassword: boolean;
      avatarColor: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    cedula: string;
    role: string;
    mustChangePassword: boolean;
    avatarColor: string;
  }
}
