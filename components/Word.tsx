'use client';

import React, { useEffect, useState } from 'react';

export default function Word() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any[]>([]);
  const [qusArr, setQusArr] = useState<any[]>([]);
  const [wholeChat, setWholeChat] = useState<any[]>([]);

  const onStart = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const response = await fetch('/api/gpt/wordchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: '', pre: [] }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      let ans = data.result.choices[0].message.content;
      setAnswer((pre) => [...pre, { role: 'assistant', content: ans }]);
      setWholeChat((pre) => [...pre, { role: 'assistant', content: ans }]);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    debugger;
    e.preventDefault();
    try {
      const response = await fetch('/api/gpt/wordchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question, pre: wholeChat }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      let ans = data.result.choices[0].message.content;
      setQusArr((pre) => [...pre, { role: 'user', content: question }]);
      //setResultImg(data.result.data[0].url);
      setAnswer((pre) => [...pre, { role: 'assistant', content: ans }]);
      setWholeChat((pre) => [...pre, { role: 'user', content: question }, { role: 'assistant', content: ans }]);
      setQuestion('');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="flex flex-col items-center">
      <div>Word</div>
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
        <button onClick={(e) => onStart(e)}>START!</button>
        {answer.length > 0 ? <div>{answer[0].content}</div> : ''}
        {qusArr.map((el, index) => (
          <div key={index}>
            <span>{index + 1}R</span>
            <span>🧑{el.content}</span>
            <span>🤖{answer[index + 1].content}</span>
          </div>
        ))}
      </div>
      <button onClick={() => console.log(wholeChat)}>CHECK</button>
    </div>
  );
}
