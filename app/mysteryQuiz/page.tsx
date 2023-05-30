'use client';

import React, { useRef, useState } from 'react';

export default function Gpt() {
  const [quizNum, setQuizNum] = useState<number>();
  const containerRef = useRef<any>(null);

  const onTest = async () => {
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
        setQuizNum(data.num);
        if (containerRef.current) {
          const container = containerRef.current;
          container.innerHTML = data.result;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex flex-col items-center">
      <div>Mystery Quiz🕵️</div>
      <div>
        <button onClick={onTest}>Start</button>
      </div>
      <div>{quizNum}</div>
      <div className="flex flex-col" ref={containerRef} />
    </main>
  );
}
