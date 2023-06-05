'use client';

import React, { useState } from 'react';
import Questions from 'components/Questions';
import Emoji from 'components/Emoji';
import Word from 'components/Word';

export default function Gpt() {
  const [questions, setQuestions] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<boolean>(false);
  const [word, setWord] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [currentType, setCurrentType] = useState<string>('');

  /** GPT 선택한 컴포넌트 호출 */
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
            <button className="custom-button bg-gray-500 hover:bg-gray-600" name="word" onClick={(e) => onPressType(e)}>
              끝말잇기
            </button>
            <button className="custom-button bg-gray-500 hover:bg-gray-600" name="que" onClick={(e) => onPressType(e)}>
              10 Q&A
            </button>
            <button
              className="custom-button bg-gray-500 hover:bg-gray-600"
              name="emoji"
              onClick={(e) => onPressType(e)}>
              Emoji 변환기
            </button>
          </div>
        </>
      )}
      {questions ? <Questions /> : ''}
      {emoji ? <Emoji /> : ''}
      {word ? <Word /> : ''}
    </main>
  );
}
