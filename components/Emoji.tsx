'use client';

import React, { useState } from 'react';

export default function Emoji() {
  const [reqValue, setReqValue] = useState<string>('');
  const [preValue, setPreValue] = useState<string>('');
  const [result, setResult] = useState<string>('');

  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gpt/emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: reqValue,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`request failed with status ${response.status}`);
      }
      const ans = data.result.choices[0].message.content;
      setResult(ans);
      setPreValue(reqValue);
      setReqValue('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div>Emoji😎 Converter</div>
      <form className="flex flex-col" onSubmit={onHandleSubmit}>
        <input
          className="border border-black mr-2 "
          type="text"
          value={reqValue}
          onChange={(e) => setReqValue(e.target.value)}
        />
        <button type="submit">Convert!</button>
      </form>
      {result ? <div>{preValue + ' ---> ' + result}</div> : ''}
    </div>
  );
}
