import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt callback called');
      console.log('Token:', token);
      console.log('User:', user);
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.name = token.name;
      session.role = token.role;
      session.accessToken = token.accessToken;
      return session;
    },
  },
});