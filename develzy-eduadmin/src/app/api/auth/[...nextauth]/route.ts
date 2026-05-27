import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Return mock Super Admin developer user for testing
        return {
          id: "dev-user-999",
          name: "DEVELZY Developer",
          email: "developer@develzy.com",
          role: "super_admin",
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "develzy-super-secret-popup-key-991",
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
