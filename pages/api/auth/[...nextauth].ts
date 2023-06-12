import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { connectDB } from 'util/database';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.CLIENT_ID ? process.env.CLIENT_ID : '',
      clientSecret: process.env.CLIENT_PW ? process.env.CLIENT_PW : '',
    }),
  ],
  secret: process.env.JWT_SECRET,
  adapter: MongoDBAdapter(connectDB),
};
export default NextAuth(authOptions);
