import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import jsonwebtoken, { Jwt } from "jsonwebtoken";

export const OPTIONS: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) =>
      jsonwebtoken.sign(
        {
          ...token,
          iss: "nextauth",
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 60,
        },
        secret
      ),
    // @ts-ignore
    decode: async ({ secret, token }) =>
      jsonwebtoken.verify(token!, secret) as Jwt,
  },
  // callbacks: {
  //   async jwt({ token, profile }) {
  //     if (profile) {
  //       token.username = profile?.login
  //     }
  //     return token
  //   },
  //   session({ session, token }) {
  //     if (token.username) {
  //       session.username = token?.username
  //     }
  //     return session
  //   }
  // }
};

const handler = NextAuth(OPTIONS);

export { handler as GET, handler as POST };
