'use client';

import React, { useRef, useState } from 'react';

interface numSeq {
  num: number;
  seq: string;
}

export default function Mystery() {
  const [quizNum, setQuizNum] = useState<numSeq>({
    num: 0,
    seq: '',
  });
  const [start, setStart] = useState(false);
  const [reset, setReset] = useState(false);
  const containerRef = useRef<any>(null);
  const containerAnswerRef = useRef<any>(null);

  const onQuizAnswer = async () => {
    try {
      const response = await fetch('/api/mysteryQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num: quizNum.num, seq: quizNum.seq }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      } else {
        if (containerAnswerRef.current) {
          const containerAnswer = containerAnswerRef.current;
          containerAnswer.innerHTML = data.result;
        }
        setReset(true);
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const onSearchQuiz = async () => {
    try {
      const response = await fetch('/api/mysteryQuiz', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      } else {
        setQuizNum({ num: data.num, seq: data.seq });
        if (containerRef.current) {
          const container = containerRef.current;
          container.innerHTML = data.result;
        }
        if (reset) {
          // '다음 퀴즈' 버튼을 클릭한 경우
          setStart(true);
          if (containerAnswerRef.current) {
            containerAnswerRef.current.innerHTML = '';
          }
        } else {
          // '시작' 버튼을 클릭한 경우
          setStart(true);
        }
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center">
      <div className="text-3xl font-bold mb-8">추리퀴즈🕵️</div>
      <div>
        <button className="bg-gray-500 hover:bg-gray-600 custom-button" onClick={onSearchQuiz}>
          {reset ? '다음 퀴즈' : '시작'}
        </button>
      </div>
      <div className="flex flex-col p-10">
        <div ref={containerRef} />
        {start ? (
          <button onClick={onQuizAnswer} className="bg-gray-500 hover:bg-gray-600 custom-button">
            정답
          </button>
        ) : (
          ''
        )}
        <div ref={containerAnswerRef} />
      </div>
    </main>
  );
}
