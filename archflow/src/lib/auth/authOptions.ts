import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";

function buildProviders(): NextAuthOptions["providers"] {
  const providers: NextAuthOptions["providers"] = [];

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    );
  }

  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM ?? "ArchFlow <noreply@archflow.app>",
      sendVerificationRequest: async ({ identifier, url }) => {
        if (!process.env.EMAIL_SERVER || process.env.NODE_ENV === "development") {
          console.log(`[ArchFlow auth] Magic link for ${identifier}: ${url}`);
          return;
        }

        const { createTransport } = await import("nodemailer");
        const transport = createTransport(process.env.EMAIL_SERVER);
        await transport.sendMail({
          to: identifier,
          from: process.env.EMAIL_FROM ?? "ArchFlow <noreply@archflow.app>",
          subject: "Sign in to ArchFlow",
          text: `Sign in to ArchFlow\n\n${url}\n\n`,
          html: `<p>Sign in to ArchFlow</p><p><a href="${url}">Click here to sign in</a></p>`,
        });
      },
    }),
  );

  if (process.env.AUTH_DEV_CREDENTIALS === "true") {
    providers.push(
      CredentialsProvider({
        id: "dev-credentials",
        name: "Dev sign-in",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;

          if (email !== "dev@archflow.local" || password !== "dev") {
            return null;
          }

          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              name: "Dev User",
              emailVerified: new Date(),
            },
          });

          return user;
        },
      }),
    );
  }

  return providers;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: buildProviders(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
