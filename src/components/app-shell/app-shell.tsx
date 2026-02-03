// src/components/app-shell/app-shell.tsx

'use client';

import * as React from 'react';
import { AppShellTopNav } from './app-shell-topnav';
import { AppShellSidebar } from './app-shell-sidebar';

export function AppShell({
  children,
  userEmail
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppShellTopNav userEmail={userEmail} />

      {/* Wider app shell */}
      <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-6 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <AppShellSidebar />
        </aside>

        {/* min-w-0 prevents overflow issues with wide tables/maps */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
