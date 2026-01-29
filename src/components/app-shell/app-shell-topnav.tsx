// src/components/app-shell/app-shell-topnav.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';

export function AppShellTopNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const supabase = React.useMemo(() => supabaseBrowser(), []);

  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-sm font-semibold tracking-wide">
          artifact-analyzer
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-neutral-400 sm:inline">
            {userEmail}
          </span>

          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
              router.refresh();
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
