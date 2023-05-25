import * as dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

dotenv.config({ path: __dirname + '/.env' });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const question = req.body.question || '';
  const { pre } = req.body;

  if (pre.length > 0) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Let's play "10 Questions" game! If you understand the game and are ready to play, answer "START🤖".`,
            },
            ...pre,
            { role: 'user', content: question },
          ],
          temperature: 0.6,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      console.log(response.data);
      res.status(200).json({ result: response.data });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  } else {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Let's play "10 Questions" game! If you understand the game and are ready to play, answer "START🤖".`,
            },
            { role: 'user', content: 'r u ready?' },
          ],
          temperature: 0.6,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      console.log(response.data);
      res.status(200).json({ result: response.data });
    } catch (error) {
      console.log(error);
      return res.status(500);
    }
  }
}
