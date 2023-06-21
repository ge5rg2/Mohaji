'use client';

import React, { useState, useEffect } from 'react';
import Questions from 'components/Questions';
import Emoji from 'components/Emoji';
import Word from 'components/Word';
import { getSession } from 'next-auth/react';
import { ResultData, userType } from '../interface/types';

export default function Gpt() {
  const [questions, setQuestions] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<boolean>(false);
  const [word, setWord] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<string>('');
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [userInfo, setUserInfo] = useState<userType | null>(null);
  /** GPT 선택한 컴포넌트 호출
   * DB에 사용가능한 토큰 수를 각 게임마다 할당.  사용시 토큰 개수 차감
   */
  const onPressType = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name } = e.target as HTMLButtonElement;
    if (name == 'word') {
      setCurrentType('word');
      setQuestions(false);
      setEmoji(false);
      setWord(true);
    } else if (name == 'que') {
      setCurrentType('que');
      setEmoji(false);
      setWord(false);
      setQuestions(true);
    } else {
      setCurrentType('emoji');
      setWord(false);
      setQuestions(false);
      setEmoji(true);
    }
    return setSelected(true);
  };

  /** GPT 선택 창으로 이동 */
  const onReturnHome = () => {
    if (currentType == 'word') {
      setWord(false);
    } else if (currentType == 'que') {
      setQuestions(false);
    } else {
      setEmoji(false);
    }
    setCurrentType('');
    return setSelected((pre) => !pre);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const response = await fetch(`/api/userInfo?email=${session?.user?.email}`, { method: 'GET' });
      const result = await response.json();

      setResultData(result);
      if (session?.user) {
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
    <main className="flex flex-col items-center">
      {selected ? (
        <div className="flex items-center justify-between w-2/4">
          <div>
            <button className="custom-button " name="home" onClick={onReturnHome}>
              🏠
            </button>
          </div>
          <div>
            <button className="custom-button " name="token" onClick={(e) => onPressType(e)}>
              🪙
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="font-bold">다음 목록 중 하나를 선택하세요</div>
          <div className="flex items-center">
            <div className="flex-col ">
              <div>
                <button
                  className="custom-button bg-gray-500 hover:bg-gray-600"
                  name="word"
                  onClick={(e) => onPressType(e)}>
                  끝말잇기
                </button>
              </div>
              <span className="text-center block mt-1">🪙{resultData?.token.word}</span>
            </div>
            <div className="flex-col ">
              <div>
                <button
                  className="custom-button bg-gray-500 hover:bg-gray-600"
                  name="que"
                  onClick={(e) => onPressType(e)}>
                  10 Q&A
                </button>
              </div>
              <span className="text-center block mt-1">🪙{resultData?.token.quiz}</span>
            </div>
            <div className="flex-col ">
              <div>
                <button
                  className="custom-button bg-gray-500 hover:bg-gray-600"
                  name="emoji"
                  onClick={(e) => onPressType(e)}>
                  Emoji 변환기
                </button>
              </div>
              <span className="text-center block mt-1">🪙{resultData?.token.emoji}</span>
            </div>
          </div>
        </>
      )}
      {questions ? <Questions /> : ''}
      {emoji && userInfo ? <Emoji /> : ''}
      {word ? <Word /> : ''}
    </main>
  );
}
