import * as dotenv from 'dotenv';
import { Configuration } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

dotenv.config({ path: __dirname + '/.env' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: 'OpenAI API key not configured',
      },
    });
    return;
  }

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

/* 
gpt-3.5-turbo -> 1000token 0.002달러
그림 그리기 기능 0.04,5 달러   
  const response = await openai.createImage({
    prompt: `${question}`,
    n: 1,
    size: '1024x1024',
  }); */

// response 확인 및 프롬포트 수정, 토큰 개수 확인, 이용자는 하루에 5번 이용가능
