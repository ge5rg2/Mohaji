import { connectDB } from 'util/database';

export default async function Home() {
  let db = (await connectDB).db('todo');
  let result = await db.collection('country').find().toArray();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold underline">{result[0].test}</h1>
    </main>
  );
}
