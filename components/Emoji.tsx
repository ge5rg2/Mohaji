'use client';

import React, { useState } from 'react';

interface Token {
  token: number | undefined;
}

export default function Emoji({ token }: Token) {
  const [reqValue, setReqValue] = useState<string>('');
  const [preValue, setPreValue] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [emojiToken, setEmojiToken] = useState(token);

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
      } else {
        const ans = data.result.choices[0].message.content;
        if (data.token == 1) {
          if (emojiToken && emojiToken > 1) {
            setEmojiToken((preToken) => (preToken ?? 0) - 1);
          } else {
            alert('토큰을 전부 사용했습니다. 메인 페이지로 이동합니다.');
            window.location.reload();
          }
        }
        setResult(ans);
        setPreValue(reqValue);
        setReqValue('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold mb-8">Emoji😎 변환기</div>
      <span className="text-xs">변환시 보유 토큰이 1 차감됩니다. 현재 보유 {emojiToken}</span>
      <form onSubmit={onHandleSubmit}>
        <input
          className="border border-black mr-2 p-2"
          type="text"
          value={reqValue}
          onChange={(e) => setReqValue(e.target.value)}
        />
        <button className="custom-button bg-blue-500 hover:bg-blue-600" type="submit">
          변환!
        </button>
      </form>
      {result ? (
        <div>
          <div className="div_box mb-3">{preValue}</div>
          <div className="text-center text-2xl">⬇️</div>
          <div className="div_box mt-3">{result}</div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}
