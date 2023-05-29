import { connectDB } from 'util/database';

export default async function Home() {
  const db = (await connectDB).db('todo');
  const result = await db.collection('country').find().toArray();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold underline">{result[0].test}</h1>
    </main>
  );
}
