'use client';

import React, { useEffect, useState } from 'react';
import Questions from 'components/Questions';
import Emoji from 'components/Emoji';
import Word from 'components/Word';

export default function Gpt() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string[]>([]);
  const [qusArr, setQusArr] = useState<string[]>([]);
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

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      let ans = data.result.choices[0].message.content;
      setQusArr((pre) => [...pre, question]);
      //setResultImg(data.result.data[0].url);
      setAnswer((pre) => [...pre, ans]);
      setQuestion('');
    } catch (error) {
      console.log(error);
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
          Speak only in Emoji
        </button>
      </div>
      {questions ? <Questions /> : ''}
      {emoji ? <Emoji /> : ''}
      {word ? <Word /> : ''}
      {/*  <>
        <form onSubmit={onHandleSubmit}>
          <input
            className="border border-black mr"
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit">제시어</button>
        </form>
        <div>
          {qusArr.map((el, index) => (
            <div key={index}>
              <span>{index + 1}R</span>
              <span>🧑{el}</span>
              <span>🤖{answer[index]}</span>
            </div>
          ))}
        </div>
      </> */}
    </main>
  );
}
