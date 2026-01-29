// src/lib/api/with-auth.ts

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export type AuthedCtx = {
  sb: ReturnType<typeof createServerClient>;
  userId: string;
};

export async function withAuthApi<T>(fn: (ctx: AuthedCtx) => Promise<T>) {
  const cookieStore = await cookies();

  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // route handlers can usually set; safe to try
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {}
        }
      }
    }
  );

  const { data, error } = await sb.auth.getUser();
  if (error || !data.user) {
    const e: any = new Error('Unauthorized');
    e.status = 401;
    throw e;
  }

  return fn({ sb, userId: data.user.id });
}

export function jsonOk(data: any, init?: ResponseInit) {
  return Response.json({ ok: true, data }, init);
}

export function jsonError(err: any) {
  const status = err?.status ?? 500;
  const message = err?.message ?? 'Unknown error';
  return Response.json({ ok: false, error: { message } }, { status });
}
