// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         const res = await fetch('http://192.168.109.149:4010/api/auth/login', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(credentials),
//         });

//         if (!res.ok) {
//           throw new Error('Failed to fetch user');
//         }

//         const user = await res.json();

//         if (user && user.token) {
//           return {
//             id: user.id,
//             email: user.email,
//             name: user.name,
//             role: user.role,
//             accessToken: user.token,
//           };
//         }
//         console.log(user,"user")

//         return null;
//       },
//     }),
//   ],
//   pages: {
//     signIn: '/login',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       console.log('jwt callback called');
//     console.log('Token:', token);
//     console.log('User:', user);
//       if (user) {
//         token.id = user.id;
//         token.email = user.email;
//         token.name = user.name;
//         token.role = user.role;
//         token.accessToken = user.accessToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.id = token.id;
//       session.email = token.email;
//       session.name = token.name;
//       session.role = token.role;
//       session.accessToken = token.accessToken;
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

// export const POST = NextAuth(authOptions);
export { GET, POST } from "@/auth";