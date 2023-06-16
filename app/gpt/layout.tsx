'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface childProps {
  children: ReactNode;
}

export default function Layout({ children }: childProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
