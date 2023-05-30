import axios, { AxiosResponse, AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
const cheerio = require('cheerio');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const randomQuiz = Math.floor(Math.random() * (3650 - 3200 + 1)) + 3200;
  if (req.method !== 'GET') {
    return res.status(400).json('This is an incorrect approach.');
  } else {
    axios({
      // 크롤링을 원하는 페이지 URL
      url: `https://www.nis.go.kr:4016/CM/1_5_1/view.do?seq=${randomQuiz}&currentPage=52&selectBox=0&searchKeyword=&fromDate=&toDate=`,
      method: 'GET',
    })
      .then((response: AxiosResponse) => {
        const $ = cheerio.load(response.data);
        const sourceData = $(
          '#selectListForm > div > div.board-detail > div.board-content.txt-spo-body-2-400.font-gray01',
        ).html();
        console.log(sourceData);
        return res.status(200).json({ result: sourceData, num: randomQuiz });
      })
      .catch((err: AxiosError) => {
        return console.error(err);
      });
  }
}
// 3200 -
// https://www.nis.go.kr:4016/CM/1_5_1/view.do?seq=3664&currentPage=1&selectBox=&searchKeyword=&fromDate=&toDate= -> 문제

// https://www.nis.go.kr:4016/CM/1_5_1/view.do?seq=3149&currentPage=1&selectBox=1&searchKeyword=400&fromDate=&toDate= -> 400번 고정
// https://www.nis.go.kr:4016/CM/1_5_2/view.do?seq=429645&currentPage=1&quizNum=3149&selectBox=1&searchKeyword=400&fromDate=&toDate=

// https://www.nis.go.kr:4016/CM/1_5_2/view.do?seq=551807&currentPage=1&quizNum=3664&selectBox=&searchKeyword=&fromDate=&toDate=
// https://www.nis.go.kr:4016/CM/1_5_2/view.do?seq=550847&currentPage=1&quizNum=3663&selectBox=&searchKeyword=&fromDate=&toDate=
// https://www.nis.go.kr:4016/CM/1_5_2/view.do?seq=550236&currentPage=1&quizNum=3662&selectBox=&searchKeyword=&fromDate=&toDate=
// #\33 664 > td.border-gray04.row-title > a
