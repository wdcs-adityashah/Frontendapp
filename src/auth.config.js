import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch('http://192.168.109.149:4010/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
        console.log(res,"res")

        if (!res.ok) {
          throw new Error('Failed to fetch user');
        }
        
        const user = await res.json();
        console.log(user, "user")

        if (user && user.token) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken: user.token,
          };
        }


        return null;
      },
    }),
  ],
}