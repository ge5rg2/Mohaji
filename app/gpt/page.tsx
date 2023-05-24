'use client';

import React, { useEffect, useState } from 'react';

export default function Gpt() {
  const [question, setQuestion] = useState('');
  const [resultImg, setResultImg] = useState('');
  const [answer, setAnswer] = useState();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      debugger;
      setResultImg(data.result.data[0].url);
      //setAnswer(data.result);
      setQuestion('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <main>
      <div>GPT</div>
      <>
        <form onSubmit={handleSubmit}>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <button type="submit">질문하기</button>
        </form>
        <div>{answer}</div>
        <img src={resultImg} />
      </>
    </main>
  );
}
