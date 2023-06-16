import * as dotenv from 'dotenv';
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { authOptions } from '../auth/[...nextauth]';
import { connectDB } from 'util/database';
import { getServerSession } from 'next-auth';

dotenv.config({ path: __dirname + '/.env' });

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { value } = req.body || '';

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Convert my sentences to "EMoji" from now on.',
          },
          { role: 'user', content: value },
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
    const db = (await connectDB).db('test');
    const decreaseToken = await db
      .collection('users')
      .findOneAndUpdate({ email: session?.user?.email }, { $inc: { 'gptToken.emoji': -1 } });
    res.status(200).json({ result: response.data, token: decreaseToken.ok });
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
