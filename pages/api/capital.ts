import { connectDB } from 'util/database';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(400).json('This is an incorrect approach.');
  } else {
    const client = await connectDB;
    const db = client.db('todo');
    const { level } = req.query;
    let result = await db.collection('capital').findOne({ level: Number(level) });
    return res.status(200).json(result?.list);
  }
}
