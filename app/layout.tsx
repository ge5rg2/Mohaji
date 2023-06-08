//import { Inter } from 'next/font/google';
import './styles/globals.css';
import Link from 'next/link';
import Head from 'next/head';
import LoginBtn from './LoginBtn';
import LogoutBtn from './LogoutBtn';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'Mohaji',
  description: '',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="initial-scale=1.0, user-scalable=no, maximum-scale=1, width=device-width" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        <div className="navbar">
          <Link href="/baseball">⚾</Link>
          <Link href="/country">🌎</Link>
          <Link href="/" className="logo">
            Mohaji
          </Link>
          <Link href="/gpt">🤖</Link>
          <Link href="/mysteryQuiz">🕵️</Link>
          {session !== null ? <LogoutBtn /> : <LoginBtn />}
        </div>
        {children}
      </body>
    </html>
  );
}
