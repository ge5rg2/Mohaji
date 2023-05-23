'use client';

import React, { useEffect, useState } from 'react';

/**
 * DB를 활용해서 유저가 맞춘 시간으로 타임순위를 기록할 수 있는 기록판 생성
 * 추후 4숫자 맞히기 등 난이도 조절 필요
 */

export default function Baseball() {
  const resultElement = document.querySelector('#result');
  const [chance, setChance] = useState<number>(9);
  const [answer, setAnswer] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [lastUserAnswer, setLastUserAnswer] = useState<number[]>([]);
  const [lastResultAnswer, setLastResultAnswer] = useState<string[]>([]);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isHomerun, setIsHomeRun] = useState<boolean>(false);

  /** 리셋 혹은 시작 함수 */
  const onReset = () => {
    setUserAnswer('');
    setLastResultAnswer([]);
    setLastUserAnswer([]);
    setChance(9);
    if (resultElement) {
      resultElement.innerHTML = '';
    }
    random_number();
    setIsStart(true);
  };

  /** 난수 생성 함수 */
  const random_number = async () => {
    if (answer.length === 3) {
      setAnswer([]);
    }
    let number_candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let newAnswer = [];
    for (var i = 0; i < 3; i += 1) {
      var picked = number_candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
      newAnswer.push(picked);
    }
    setAnswer(newAnswer);
  };

  /** Input 변경 시 동작 함수 */
  const onAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    const numericRegex = /^[0-9]+$/;

    if (!numericRegex.test(value)) {
      return;
    }
    if (value) {
      const newArr = value.split('');
      if (newArr.length > 1) {
        const checkDuplicate = newArr.filter((el, index) => el === newArr[index - 1]);
        if (checkDuplicate.length > 0 || newArr[0] === newArr[newArr.length - 1]) {
          return;
        } else {
          setUserAnswer(value);
        }
      } else {
        setUserAnswer(value);
      }
    } else {
      setUserAnswer(value);
    }
  };

  /** 제출 시 동작 함수 */
  const onCheck = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLastUserAnswer((pre) => [...pre, Number(userAnswer)]);
    if (userAnswer === answer.join('')) {
      // 정답을 맞췄을 경우
      alert('Home run!');
      if (resultElement) {
        setLastResultAnswer((pre) => [...pre, 'HOMERUN']);
        resultElement.innerHTML = 'Homerun!!!👏';
      }
      setIsHomeRun(true);
      setUserAnswer('');
      setIsStart(false);
    } else {
      let answer_array = userAnswer.split('');
      let strike = 0;
      let ball = 0;
      setChance((lastChance) => (lastChance -= 1));
      let life = chance;
      if (life < 1) {
        // 10번 넘게 틀린 경우
        alert(`fail!! the answer is ${{ ...answer }}`);
        setUserAnswer('');
        random_number();
        setChance(10);
      } else {
        // 10번 미만으로 틀린 경우
        for (var i = 0; i < 3; i += 1) {
          if (Number(answer_array[i]) === answer[i]) {
            strike += 1;
          } else if (answer.indexOf(Number(answer_array[i])) > -1) {
            ball += 1;
          }
        }

        if (resultElement) {
          if (strike == 0 && ball == 0) {
            setLastResultAnswer((pre) => [...pre, 'OUT']);
            resultElement.innerHTML = 'OUT 😩';
          } else {
            setLastResultAnswer((pre) => [...pre, strike + ' strike ' + ball + ' ball ']);
            resultElement.innerHTML = strike + ' strike ' + ball + ' ball ';
          }
        }
      }

      setUserAnswer('');
      console.log(answer);
    }
  };

  useEffect(() => {
    setAnswer([]);
    setChance(9);
  }, []);

  return (
    <main className="flex flex-col items-center">
      <div>Baseball ⚾️</div>
      <div id="question">Guess 3 digit random number! Each number is different.</div>
      <div id="result"></div>
      <div>{...answer}</div>
      <div>
        <span>Your chance: {chance}</span>
        <span id="remainedChance"></span>
      </div>
      {isStart ? (
        <form id="answer_form" onSubmit={(e) => onCheck(e)}>
          <input
            className="border border-black mr"
            required={true}
            maxLength={3}
            value={userAnswer}
            id="answerInput"
            type="text"
            onChange={(e) => onAnswerChange(e)}
          />
          <button>submit</button>
        </form>
      ) : (
        ''
      )}

      <button onClick={onReset}>{isStart ? 'Reset' : isHomerun ? 'Try again?' : 'Start!'}</button>
      {lastUserAnswer.length > 0 ? (
        <div>
          last answer
          {lastUserAnswer.map((e, index) => (
            <div>
              <span className="m-2">{e}</span>
              <span className="m-2">{lastResultAnswer[index]}</span>
            </div>
          ))}
        </div>
      ) : (
        ''
      )}
    </main>
  );
}
