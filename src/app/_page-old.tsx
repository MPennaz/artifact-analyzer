import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/login');

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="opacity-80">Signed in as {data.user.email}</p>
    </main>
  );
}

