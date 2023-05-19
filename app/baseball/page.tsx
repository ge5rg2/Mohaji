'use client';

import React, { useEffect, useState } from 'react';

// 참고
// https://velog.io/@devmoonsh/JavaScript-%EC%88%AB%EC%9E%90%EC%95%BC%EA%B5%AC-%EA%B2%8C%EC%9E%84-%EA%B5%AC%ED%98%84
/**
 * 4자리 난수 생성 - function
 * 입력한 숫자 결과 리스트 불러오기 -> state array
 * count state 추가 -> count>= 10 시 실패
 */

export default function Baseball() {
  const [chance, setChance] = useState<number>(10);
  const [answer, setAnswer] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');

  const random_number = async () => {
    if (answer.length === 4) {
      setAnswer([]);
    }
    let number_candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let newAnswer = [];
    for (var i = 0; i < 4; i += 1) {
      var picked = number_candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
      newAnswer.push(picked);
    }
    setAnswer(newAnswer);
  };

  const onAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 중복체크필요
    const { value } = e.target as HTMLInputElement;
    if (value) {
    }
    setUserAnswer(value);
  };

  const onCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userAnswer === answer.join('')) {
      // 정답을 맞췄을 경우
      alert('Home run!');
      setUserAnswer('');
      random_number();
      setChance(10);
    } else {
      let answer_array = userAnswer.split('');
      let strike = 0;
      let ball = 0;
      setChance((lastChance) => (lastChance -= 1));
      let life = chance;
      if (life < 1) {
        // 10번 넘게 틀린 경우
        alert('fail');
        setUserAnswer('');
        random_number();
        setChance(10);
      } else {
        // 10번 미만으로 틀린 경우
        for (var i = 0; i < 4; i += 1) {
          if (Number(answer_array[i]) === answer[i]) {
            strike += 1;
          } else if (answer.indexOf(Number(answer_array[i])) > -1) {
            ball += 1;
          }
        }
        const resultElement = document.querySelector('#result');
        if (resultElement) {
          resultElement.innerHTML = strike + ' strike ' + ball + ' ball ';
        }
        setUserAnswer('');
      }
      console.log(answer);
    }
  };

  useEffect(() => {
    setAnswer([]);
    setChance(10);
  }, []);

  return (
    <>
      <div>Baseball</div>
      <div id="question">Guess 4 digit random number! Each number is different.</div>
      <div id="result"></div>
      <div>{...answer}</div>
      <form id="answer_form" onSubmit={(e) => onCheck(e)}>
        <input maxLength={4} id="answerInput" type="text" onChange={(e) => onAnswerChange(e)} />
        <button>submit</button>
      </form>
      <div>
        <span>Your chance: {chance}</span>
        <span id="remainedChance"></span>
      </div>
      <button onClick={random_number}>reset</button>
    </>
  );
}
