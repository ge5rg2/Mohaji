'use client';
import { signIn, signOut } from 'next-auth/react';

interface LoginBtnProps {
  islogin: boolean;
}

export default function LoginBtn({ islogin }: LoginBtnProps) {
  const onLoginClick = () => {
    if (!islogin) {
      return signIn();
    } else {
      return signOut();
    }
  };

  return <button onClick={onLoginClick}>{islogin ? '🙅‍♂️' : '🙆‍♂️'}</button>;
}
