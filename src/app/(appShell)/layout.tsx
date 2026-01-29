// src/app/(appShell)/layout.tsx

import * as React from 'react';
import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import { AppShell } from '@/components/app-shell/app-shell';

export default async function AppShellLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Basic auth gate for all app pages
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/login');

  return <AppShell userEmail={data.user.email ?? ''}>{children}</AppShell>;
}
