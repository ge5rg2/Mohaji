import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.CLIENT_ID ? process.env.CLIENT_ID : '',
      clientSecret: process.env.CLIENT_PW ? process.env.CLIENT_PW : '',
    }),
  ],
  secret: process.env.JWT_SECRET,
};
export default NextAuth(authOptions);
