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
          <Link href="/baseball">baseball</Link>
          <Link href="/country">country</Link>
        </div>
        {children}
      </body>
    </html>
  );
}
