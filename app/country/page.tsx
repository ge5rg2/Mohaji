'use client';

import { useEffect, useState } from 'react';

export default function Country() {
  const [capital, setCapital] = useState<[string, string][]>([]);
  const [counter, setCounter] = useState<number>(3);
  const [start, setStart] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  let intervalId: NodeJS.Timeout | null = null;

  /** 구조분해 할당으로 배열 순서를 랜덤하게 변경해주는 함수 */
  const shuffleArray = (array: [string, string][]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const onSubmitAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputElement = (e.currentTarget as HTMLFormElement).elements.namedItem('userAnswer') as HTMLInputElement;
    const inputAnswer = inputElement.value;
    if (capital[score][1] == inputAnswer) {
      /** 전부 다 맞춘 경우 */
      if (score + 1 == capital.length) {
        alert('You all passed!!');
      } else {
        setScore((pre) => ++pre);
      }
    } else {
      /** 남은 점수 및 reset 진행 */
      alert('fail!');
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
      intervalId = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter > 0) {
            return prevCounter - 1;
          } else {
            clearInterval(intervalId!);
            return prevCounter;
          }
        });
      }, 1000); // 1초마다 숫자를 감소시키도록 설정
    } catch (error) {
      console.log(error);
    }
  };

  const onRestart = () => {
    setStart(false);
    setScore(0);
    setIsOver(false);
    setCounter(3);
  };

  useEffect(() => {
    /*     return () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }; */
  }, []);

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
            <div>Answer: {capital[score][1]}</div>
            <div>Score: {score}</div>
            <button onClick={onRestart}>Restart</button>
          </>
        ) : (
          <>
            <div>{capital[score][0]}</div>
            <div>Score: {score}</div>
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
