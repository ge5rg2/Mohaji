'use client';

import { useRef, useState } from 'react';

export default function Country() {
  const [capital, setCapital] = useState<[string, string][]>([]);
  const [counter, setCounter] = useState<number>(3);
  const [quizCounter, setQuizCounter] = useState<number>(6);
  const [start, setStart] = useState<boolean>(false);
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isClear, setIsClear] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  // 퀴즈 기록 스톱워치
  const [stopwatch, setStopwatch] = useState<number>(1);
  // 인터벌이 중복 호출되는 것을 방지하기 위한 state
  const [countDownRunning, setCountDownRunning] = useState<boolean>(false);

  const gameStartIntervalId = useRef<NodeJS.Timeout | null>(null);
  const countDownIntervalId = useRef<NodeJS.Timeout | null>(null);
  const stopwatchIntervalId = useRef<NodeJS.Timeout | null>(null);

  /** 구조분해 할당으로 배열 순서를 랜덤하게 변경해주는 함수 */
  const shuffleArray = (array: [string, string][]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const setStopWatch = () => {
    stopwatchIntervalId.current = setInterval(() => {
      setStopwatch((prevTime) => prevTime + 1);
    }, 1000);
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
          clearInterval(stopwatchIntervalId.current!);
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
        clearInterval(stopwatchIntervalId.current!);
        setCountDownRunning(false);
        alert(`통과!! 당신은 ${stopwatch}초만에 완료했습니다.`);
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
      clearInterval(stopwatchIntervalId.current!);
      setCountDownRunning(false);
      setIsOver(true);
    }
    return (inputElement.value = '');
  };

  /** 퀴즈 난이도 선택 및 시작 함수 */
  const onStrat = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { name } = e.target as HTMLButtonElement;
    try {
      const response = await fetch(`/api/capital?level=${name}`, { method: 'GET' });
      const result = await response.json();
      const parsedData = JSON.parse(result);
      setStart(true);
      setCapital(shuffleArray(Object.entries(parsedData)));
      gameStartIntervalId.current = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter > 0) {
            return prevCounter - 1;
          } else {
            clearInterval(gameStartIntervalId.current!);
            setStopwatch(1);
            setStopWatch();
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
    clearInterval(stopwatchIntervalId.current!);
    setCountDownRunning(false);
    setQuizCounter(6);
    setStopwatch(1);
  };

  return (
    <main className="flex flex-col items-center">
      <div className="text-3xl font-bold mb-8">수도퀴즈 🌎</div>
      {start ? (
        ''
      ) : (
        <div className="mb-4 text-center flex flex-col">
          난이도
          <div>
            <button className="tpyebutton m-2" name="1" onClick={(e) => onStrat(e)}>
              1단계
            </button>
            <button className="tpyebutton m-2" name="2" onClick={(e) => onStrat(e)}>
              2단계
            </button>
            <button className="tpyebutton m-2" name="3" onClick={(e) => onStrat(e)}>
              3단계
            </button>
            <button className="tpyebutton m-2" name="4" onClick={(e) => onStrat(e)}>
              4단계
            </button>
          </div>
        </div>
      )}
      {start ? (
        counter > 0 ? (
          <>
            <div className="text-2xl font-bold mb-4">{counter}</div>
          </>
        ) : isOver ? (
          <>
            {isClear ? (
              <div className="text-xl font-bold mb-4">축하합니다!👏</div>
            ) : (
              <div className="text-xl font-bold mb-4">정답: {capital[score][1]}</div>
            )}
            <div className="text-xl mb-4">점수: {score}</div>
            <button className="bg-blue-500 hover:bg-blue-600 custom-button" onClick={onRestart}>
              재시도
            </button>
          </>
        ) : (
          <>
            <div className="text-xl mb-4">점수: {score}</div>
            <div className="text-2xl mb-4">{capital[score][0]}</div>
            <div className="text-2xl mb-4">{quizCounter}</div>
            <div>
              <form onSubmit={(e) => onSubmitAnswer(e)} className="flex items-center">
                <input name="userAnswer" className="border border-black mr-2 p-2" type="text" required={true} />
                <button className="bg-gray-500 hover:bg-gray-600 custom-button" type="submit">
                  입력
                </button>
              </form>
              {/* <div className="text-2xl">
                {Math.floor(stopwatch / 60)}분 {stopwatch % 60}초
              </div> */}
            </div>
          </>
        )
      ) : (
        ''
      )}
    </main>
  );
}
