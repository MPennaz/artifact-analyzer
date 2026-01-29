// src/app/whoami/page.tsx

import { supabaseServer } from '@/lib/supabase/server';

export default async function WhoAmI() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  return (
    <pre style={{ padding: 24 }}>
      {JSON.stringify(
        { email: data.user?.email ?? null, userId: data.user?.id ?? null },
        null,
        2
      )}
    </pre>
  );
}
