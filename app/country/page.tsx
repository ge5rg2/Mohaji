'use client';

import { useRef, useEffect, useState } from 'react';

// 클리어 시간 설정

export default function Country() {
  const [capital, setCapital] = useState<[string, string][]>([]);
  const [counter, setCounter] = useState<number>(3);
  const [quizCounter, setQuizCounter] = useState<number>(6);
  const [start, setStart] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  // 인터벌이 중복 호출되는 것을 방지하기 위한 state
  const [countDownRunning, setCountDownRunning] = useState<boolean>(false);

  const gameStartIntervalId = useRef<NodeJS.Timeout | null>(null);
  const countDownIntervalId = useRef<NodeJS.Timeout | null>(null);

  /** 구조분해 할당으로 배열 순서를 랜덤하게 변경해주는 함수 */
  const shuffleArray = (array: [string, string][]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  /** 게임 시작 시 동작하는 카운트 다운 함수 */
  const setCountDown = () => {
    // 이미 실행 중인 경우, 중복 호출 방지
    if (countDownRunning) {
      return;
    }
    setCountDownRunning(true);

    countDownIntervalId.current = setInterval(() => {
      setQuizCounter((prevCounter) => {
        if (prevCounter > 1) {
          return prevCounter - 1;
        } else {
          clearInterval(countDownIntervalId.current!);
          setCountDownRunning(false); // 실행이 완료되었음을 표시
          alert('Time out!');
          setIsOver(true);
          return prevCounter;
        }
      });
    }, 1000);
  };

  /** 정답 제출 시 동작하는 함수 */
  const onSubmitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = (e.currentTarget as HTMLFormElement).elements.namedItem('userAnswer') as HTMLInputElement;
    const inputAnswer = inputElement.value;
    if (capital[score][1] == inputAnswer) {
      /** 전부 다 맞춘 경우 */
      if (score + 1 == capital.length) {
        clearInterval(countDownIntervalId.current!);
        setCountDownRunning(false);
        alert('You all passed!!');
        setIsClear(true);
        setIsOver(true);
      } else {
        setQuizCounter(6);
        setScore((pre) => ++pre);
        setCountDown();
      }
    } else {
      /** 남은 점수 및 reset 진행 */
      alert('fail!');
      clearInterval(countDownIntervalId.current!);
      setCountDownRunning(false);
      setIsOver(true);
    }
    return (inputElement.value = '');
  };

  /** 퀴즈 난이도 선택 및 시작 함수 */
  const onChoseLevel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = (e.currentTarget as HTMLFormElement).elements.namedItem('level') as HTMLInputElement;
    const inputNumber = inputElement.value;
    try {
      const response = await fetch(`/api/capital?level=${inputNumber}`, { method: 'GET' });
      const result = await response.json();
      let parsedData = JSON.parse(result);
      setStart(true);
      setCapital(shuffleArray(Object.entries(parsedData)));
      gameStartIntervalId.current = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter > 0) {
            return prevCounter - 1;
          } else {
            clearInterval(gameStartIntervalId.current!);
            setCountDown();
            return prevCounter;
          }
        });
      }, 1000);
      // 1초마다 숫자를 감소시키도록 설정
    } catch (error) {
      console.log(error);
    }
  };

  const onRestart = () => {
    setStart(false);
    setScore(0);
    setIsOver(false);
    setCounter(3);
    clearInterval(countDownIntervalId.current!);
    clearInterval(gameStartIntervalId.current!);
    setCountDownRunning(false);
    setQuizCounter(6);
  };
  useEffect(() => {}, []);

  return (
    <main className="flex flex-col items-center">
      <div>Country 🌎</div>
      {start ? (
        ''
      ) : (
        <div>
          Chose the level
          <form onSubmit={(e) => onChoseLevel(e)}>
            <input type="number" name="level" max={4} min={1} defaultValue={1} />
            <button>Start</button>
          </form>
        </div>
      )}
      {start ? (
        counter > 0 ? (
          <div>{counter}</div>
        ) : isOver ? (
          <>
            {isClear ? <div>Congratuation!👏</div> : <div>Answer: {capital[score][1]}</div>}
            <div>Score: {score}</div>
            <button onClick={onRestart}>Restart</button>
          </>
        ) : (
          <>
            <div>Score: {score}</div>
            <div>{capital[score][0]}</div>
            <div>{quizCounter}</div>
            <div>
              <form onSubmit={(e) => onSubmitAnswer(e)}>
                <input name="userAnswer" className="border border-black mr" type="text" required={true} />
                <button type="submit">Enter</button>
              </form>
            </div>
          </>
        )
      ) : (
        ''
      )}
    </main>
  );
}
