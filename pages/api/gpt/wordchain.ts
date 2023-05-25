import * as dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

dotenv.config({ path: __dirname + '/.env' });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const question = req.body.question || '';
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `Let's play a word-chain game.If the word I say is not a noun, game over.`,
          },
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
}
