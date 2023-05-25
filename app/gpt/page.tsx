'use client';

import React, { useEffect, useState } from 'react';

export default function Gpt() {
  const [question, setQuestion] = useState('');
  //const [resultImg, setResultImg] = useState('');
  const [answer, setAnswer] = useState<string[]>([]);
  const [qusArr, setQusArr] = useState<string[]>([]);

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
      <div>🤖GPT와 끝말잇기</div>
      <>
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
        {/*  <img src={resultImg} /> */}
      </>
    </main>
  );
}
