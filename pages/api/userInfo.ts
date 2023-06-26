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
    const currentTime = new Date();
    // 처음 들어온 유저일 경우
    if (result?.setTokenTime == undefined) {
      const firstResult = await db.collection('users').findOneAndUpdate(
        { email },
        {
          $set: {
            'gptToken.emoji': 10,
            'gptToken.quiz': 10,
            'gptToken.word': 10,
            setTokenTime: currentTime.toISOString(), // Update setTokenTime to current time
          },
        },
      );

      return res.status(200).json({
        token: { emoji: 10, quiz: 10, word: 10 },
        setTokenTime: currentTime,
      });
    } else if (result?.setTokenTime && currentTime.getTime() - new Date(result.setTokenTime).getTime()) {
      const tokenTime = new Date(result.setTokenTime);
      const timeDiff = currentTime.getTime() - tokenTime.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (timeDiff >= twentyFourHours) {
        const resendResult = await db.collection('users').findOneAndUpdate(
          { email },
          {
            $set: {
              'gptToken.emoji': 10,
              'gptToken.quiz': 10,
              'gptToken.word': 10,
              setTokenTime: currentTime.toISOString(), // Update setTokenTime to current time
            },
          },
        );

        return res.status(200).json({
          token: { emoji: 10, quiz: 10, word: 10 },
          setTokenTime: currentTime,
        });
      }
    }

    return res.status(200).json({
      token: result?.gptToken,
      setTokenTime: result?.setTokenTime,
    });
  }
}
