import UserInfo from 'components/UserInfo';

export default async function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-12">
      <UserInfo />
    </main>
  );
}
