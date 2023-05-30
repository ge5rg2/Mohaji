'use client';

import React, { useState, useRef } from 'react';
import Questions from 'components/Questions';
import Emoji from 'components/Emoji';
import Word from 'components/Word';

export default function Gpt() {
  const [questions, setQuestions] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<boolean>(false);
  const [word, setWord] = useState<boolean>(false);

  const onPressType = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const ok = window.confirm('기존 대화 기록이 사라집니다. 나가시겠습니까?');
    if (ok) {
      const { name } = e.target as HTMLButtonElement;
      if (name == 'word') {
        setQuestions(false);
        setEmoji(false);
        setWord(true);
      } else if (name == 'que') {
        setEmoji(false);
        setWord(false);
        setQuestions(true);
      } else {
        setWord(false);
        setQuestions(false);
        setEmoji(true);
      }
    } else {
      return;
    }
  };

  return (
    <main className="flex flex-col items-center">
      <div>Choose keywords to play with 🤖</div>
      <div>
        <button className="custom-button bg-blue-500 hover:bg-blue-600" name="word" onClick={(e) => onPressType(e)}>
          Word-Chain
        </button>
        <button className="custom-button bg-blue-500 hover:bg-blue-600" name="que" onClick={(e) => onPressType(e)}>
          10 Questions
        </button>
        <button className="custom-button bg-blue-500 hover:bg-blue-600" onClick={(e) => onPressType(e)}>
          Emoji Converter
        </button>
      </div>
      {questions ? <Questions /> : ''}
      {emoji ? <Emoji /> : ''}
      {word ? <Word /> : ''}
    </main>
  );
}
