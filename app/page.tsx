import { connectDB } from 'util/database';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession, Session } from 'next-auth';

export default async function Home() {
  const db = (await connectDB).db('test');
  const session: Session | null = await getServerSession(authOptions);

  let user = null;
  if (session?.user) {
    const date = new Date();
    user = await db.collection('users').findOne({ email: session.user.email });
    if (!user?.gptToken) {
      const gptToken = {
        quiz: 10,
        emoji: 10,
        word: 10,
      };

      await db.collection('users').updateOne(
        { email: session.user.email },
        {
          $set: {
            gptToken,
            setTokenTime: date,
          },
        },
      );
    }
  }

  return (
    <main className="flex flex-col items-center justify-between p-12">
      {session?.user ? (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <h2 className="text-lg font-bold">User Information</h2>
          <div className="flex items-center mt-2">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
              <img src={session.user.image as string} alt="Profile Image" className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <p>
                <strong>Name:</strong> {session.user.name}
              </p>
              <p>
                <strong>Email:</strong> {session.user.email}
              </p>
              <p>
                <strong>GPT Token (Quiz):</strong> {user?.gptToken.quiz}
              </p>
              <p>
                <strong>GPT Token (Emoji):</strong> {user?.gptToken.emoji}
              </p>
              <p>
                <strong>GPT Token (Word):</strong> {user?.gptToken.word}
              </p>
              <p>
                <strong>Token Reset Time:</strong> {user?.setTokenTime.toString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-3xl font-bold underline">Welcome</h1>
      )}
    </main>
  );
}
