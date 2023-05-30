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
          <Link href="/" className="logo">
            Mohaji
          </Link>
          <Link href="/baseball">Baseball</Link>
          <Link href="/country">Country</Link>
          <Link href="/gpt">Play with GPT</Link>
          <Link href="/mysteryQuiz">Mystery Quiz</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
