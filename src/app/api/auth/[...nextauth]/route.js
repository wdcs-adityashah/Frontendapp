import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("http://localhost:4010/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }

        const responseText = await res.text();
        if (!responseText) {
          console.error('Empty response from server');
          return null;
        }

        let user;
        try {
          user = JSON.parse(responseText);
        } catch (err) {
          console.error('Error parsing JSON:', err);
          return null;
        }

        if (user && user.token) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.session.user.id;
        token.email = user.session.user.email;
        token.name = user.session.user.name;
        token.role =  user.session.user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.email = token.email;
        session.name = token.name;
        session.role = token.role; // Include role in the session
      }
      return session;
    },
  },
  
};

export const POST = NextAuth(authOptions);
