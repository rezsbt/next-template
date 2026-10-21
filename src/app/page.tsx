import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-6">
      <p>سلام</p>
      <Link href="/users" className="w-fit text-sm underline-offset-4 hover:underline">
        مشاهده کاربران
      </Link>
    </main>
  );
}
