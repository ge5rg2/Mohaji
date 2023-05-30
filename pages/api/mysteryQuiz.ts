import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';
const cheerio = require('cheerio');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  if (req.method === 'GET') {
    try {
      const randomQuiz = Math.floor(Math.random() * (604 - 250 + 1)) + 250;
      const listResponse = await axios.get(
        `https://www.nis.go.kr:4016/CM/1_5_1/list.do?selectBox=1&fromDate=&toDate=&searchKeyword=${randomQuiz}`,
      );
      const $ = cheerio.load(listResponse.data);
      const qNum = $('#board > tbody > tr').attr('id');

      if (!qNum) {
        console.log('No match found');
        return res.status(400).json('No match found');
      }

      const viewResponse = await axios.get(
        `https://www.nis.go.kr:4016/CM/1_5_1/view.do?seq=${qNum}&currentPage=1&selectBox=&searchKeyword=&fromDate=&toDate=`,
      );
      const sourceData = $(
        '#selectListForm > div > div.board-detail > div.board-content.txt-spo-body-2-400.font-gray01',
        viewResponse.data,
      ).html();

      const secondListResponse = await axios.get(
        `https://www.nis.go.kr:4016/CM/1_5_2/list.do?selectBox=1&fromDate=&toDate=&searchKeyword=${randomQuiz}`,
      );
      const seqNum = cheerio.load(secondListResponse.data)('#board > tbody > tr').attr('id');

      if (!seqNum) {
        console.log('No match found');
        return res.status(400).json('No match found');
      }

      return res.status(200).json({ result: sourceData, num: qNum, seq: seqNum });
    } catch (err) {
      console.error(err);
      return res.status(500).json('Internal Server Error');
    }
  } else if (req.method === 'POST') {
    try {
      const { num, seq } = req.body;
      const viewResponse = await axios.get(
        `https://www.nis.go.kr:4016/CM/1_5_2/view.do?seq=${seq}&currentPage=1&quizNum=${num}&selectBox=&searchKeyword=&fromDate=&toDate=`,
      );
      const $ = cheerio.load(viewResponse.data);
      const answerData = $(
        '#selectListForm > div > div.board-detail > div.board-content.answer-content.txt-spo-body-2-400.font-gray01 > p:nth-child(3)',
      ).html();
      return res.status(200).json({ result: answerData });
    } catch (err) {
      console.error(err);
      return res.status(500).json('Internal Server Error');
    }
  } else {
    return res.status(400).json('This is an incorrect approach.');
  }
}
