//import { Inter } from 'next/font/google';
import './styles/globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Mohaji',
  description: '',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="navbar">
          <Link href="/baseball">⚾</Link>
          <Link href="/country">🌎</Link>
          <Link href="/" className="logo">
            Mohaji
          </Link>
          <Link href="/gpt">🤖</Link>
          <Link href="/mysteryQuiz">🕵️</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
