// src/components/logout-button.tsx

'use client';

import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  return (
    <button
      className="rounded border px-3 py-2"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
