'use client';

import { getSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { ResultData, userType } from '@/basic/interface/types';

export default function UserInfo() {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (!session) {
        return setIsLogin(false);
      }

      const response = await fetch(`/api/userInfo?email=${session?.user?.email}`, { method: 'GET' });
      const result = await response.json();

      setResultData(result);
      if (session?.user) {
        setIsLogin(true);
        const userInfo: userType = {
          name: session.user.name || '',
          email: session.user.email || '',
          image: session.user.image || '',
        };
        setUserInfo(userInfo);
      }
    };
    fetchSession();
  }, []);

  return (
    <>
      {isLogin ? (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-lg font-bold">User Information</h2>
          <div className="flex items-center mt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
              <img src={userInfo?.image as string} alt="Profile Image" className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <p>
                <strong>Name:</strong> {userInfo?.name}
              </p>
              <p>
                <strong>Email:</strong> {userInfo?.email}
              </p>
              <p>
                <strong>Token (Quiz):</strong> {resultData?.token.quiz}
              </p>
              <p>
                <strong>Token (Emoji):</strong> {resultData?.token.emoji}
              </p>
              <p>
                <strong>Token (Word):</strong> {resultData?.token.word}
              </p>
              <p>
                <strong>Token Time:</strong> {resultData?.setTokenTime.toString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-lg font-bold">WELCOME!</h2>
        </div>
      )}
    </>
  );
}
