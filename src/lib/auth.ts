import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Cedula",
      credentials: {
        cedula: { label: "Cedula", type: "text" },
        password: { label: "Contrasena", type: "password" },
      },
      async authorize(credentials) {
        const cedula = credentials?.cedula?.toString().trim();
        const password = credentials?.password?.toString();
        if (!cedula || !password) return null;

        const user = await prisma.user.findUnique({ where: { cedula } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          cedula: user.cedula,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
          avatarColor: user.avatarColor,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.cedula = (user as { cedula: string }).cedula;
        token.role = (user as { role: string }).role;
        token.mustChangePassword = (user as { mustChangePassword: boolean }).mustChangePassword;
        token.avatarColor = (user as { avatarColor: string }).avatarColor;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.cedula = token.cedula as string;
        session.user.role = token.role as string;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
        session.user.avatarColor = token.avatarColor as string;
      }
      return session;
    },
  },
});
