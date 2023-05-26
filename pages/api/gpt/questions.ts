import * as dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

dotenv.config({ path: __dirname + '/.env' });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const question = req.body.question || '';
  const { pre, keyword, tpye } = req.body;
  let promptAsk = `Your considering ${keyword}. I must query to you, and you shall respond with a yes or no. Based on your response, I must determine the ${keyword} your thinking of. If i get it right within 10 querys, you loose!`;
  let promptAns = `I’m considering ${keyword}. You must query to me, and I shall respond with a yes or no. Based on my response, you must determine the ${keyword} I thinking of. If you get it right within 10 querys, you win!`;

  if (pre.length > 0) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: tpye == 'q' ? promptAsk : promptAns,
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
              content: tpye == 'q' ? promptAsk : promptAns,
            },
            {
              role: 'user',
              content:
                tpye == 'q'
                  ? 'If you understand the game and are ready to play, answer "START🤖".'
                  : `Begin with the first query.`,
            },
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
