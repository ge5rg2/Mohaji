import { connectDB } from 'util/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json('This is an incorrect approach.');
  } else {
    const client = await connectDB;
    const db = client.db('test');
    const { email } = req.query;
    const result = await db.collection('users').findOne({ email });
    return res.status(200).json({
      token: result?.gptToken,
      setTokenTime: result?.setTokenTime,
    });
  }
}
