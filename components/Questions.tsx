'use client';

import React, { useState } from 'react';

/**
 * 10개의 질문에 대한 인식을 못함
 */

export default function Questions() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<any[]>([]);
  const [qusArr, setQusArr] = useState<any[]>([]);
  const [wholeChat, setWholeChat] = useState<any[]>([]);
  /** 제시어 state type state */
  const [keyword, setKeyword] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [start, setStart] = useState<boolean>(false);

  const onSetTypeButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name } = e.target as HTMLButtonElement;
    setType(name);
  };

  const onSetKeywordButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name } = e.target as HTMLButtonElement;
    setKeyword(name);
  };

  const onStart = async () => {
    try {
      const response = await fetch('/api/gpt/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: '', pre: [], keyword, type }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      setStart(true);
      const ans = data.result.choices[0].message.content;
      setAnswer((pre) => [...pre, { role: 'assistant', content: ans }]);
      setWholeChat((pre) => [...pre, { role: 'assistant', content: ans }]);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gpt/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          pre: wholeChat,
          keyword,
          type,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      const ans = data.result.choices[0].message.content;
      setQusArr((pre) => [...pre, { role: 'user', content: question }]);
      //setResultImg(data.result.data[0].url);
      setAnswer((pre) => [...pre, { role: 'assistant', content: ans }]);
      setWholeChat((pre) => [...pre, { role: 'user', content: question }, { role: 'assistant', content: ans }]);
      setQuestion('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>10 Questions</h1>
      {start ? (
        <>
          <form onSubmit={onHandleSubmit}>
            <input
              className="border border-black mr-2 "
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button type="submit">Ask!</button>
          </form>
          {type == 'q' ? (
            <div>
              {answer.length > 0 ? <div>{answer[0].content}</div> : ''}
              {qusArr.map((el, index) => (
                <div key={index}>
                  <span>{10 - (index + 1)}🕐</span>
                  <span>🧑{el.content}</span>
                  <span>🤖{answer[index + 1].content}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              {answer.length > 0 ? <div>{answer[answer.length - 1].content}</div> : ''}
              {qusArr.map((el, index) => (
                <div key={index}>
                  <span>{10 - (index + 1)}🕐</span>
                  <span>🧑{el.content}</span>
                  <span>🤖{answer[index].content}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : type !== '' ? (
        keyword ? (
          <button className="custom-button bg-blue-500 hover:bg-blue-600" onClick={onStart}>
            START!
          </button>
        ) : (
          <div>
            <button className="tpyebutton m-2" name="characters" onClick={(e) => onSetKeywordButton(e)}>
              Characters
            </button>
            <button className="tpyebutton m-2" name="things" onClick={(e) => onSetKeywordButton(e)}>
              Things
            </button>
          </div>
        )
      ) : (
        <div>
          <button className="tpyebutton m-2" name="q" onClick={(e) => onSetTypeButton(e)}>
            Q
          </button>
          <button className="tpyebutton m-2" name="a" onClick={(e) => onSetTypeButton(e)}>
            A
          </button>
        </div>
      )}
    </div>
  );
}
