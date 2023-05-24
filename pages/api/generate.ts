import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

dotenv.config({ path: __dirname + '/.env' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${question}`,
    temperature: 0,
    max_tokens: 100,
  });
  /* 그림 그리기 기능 0.04,5 달러   
  const response = await openai.createImage({
    prompt: `${question}`,
    n: 1,
    size: '1024x1024',
  }); */

  console.log(response.data);

  res.status(200).json({ result: response.data });
}

// response 확인 및 프롬포트 수정, 토큰 개수 확인, 이용자는 하루에 5번 이용가능
