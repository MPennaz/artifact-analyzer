// src/components/app-shell/app-shell-topnav.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

import { Button } from '@/components/ui/button';
import { Sparkles, LogOut } from 'lucide-react';

export function AppShellTopNav({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const supabase = React.useMemo(() => supabaseBrowser(), []);

  return (
    <header className="relative z-30 border-b border-neutral-800 bg-neutral-950">
      {/* subtle glow divider */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo / Brand */}
        <Link href="/" className="group flex items-center gap-3">
          <span
            className={[
              'grid h-9 w-9 place-items-center rounded-md border',
              'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200',
              'shadow-[0_0_12px_rgba(217,70,239,0.15)]'
            ].join(' ')}
          >
            <Sparkles className="h-4 w-4" />
          </span>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-neutral-100">
              Artifact Analyzer
            </div>
            <div className="text-[11px] text-neutral-400 group-hover:text-neutral-300">
              Spatial analysis & AI insights
            </div>
          </div>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            <span className="hidden sm:inline-flex items-center rounded-md border border-neutral-800 bg-neutral-900/40 px-2 py-1 text-xs text-neutral-300">
              {userEmail}
            </span>
          ) : null}

          <Button
            variant="outline"
            className="gap-2"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
              router.refresh();
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
