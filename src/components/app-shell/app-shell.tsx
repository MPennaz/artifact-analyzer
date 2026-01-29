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

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <AppShellSidebar />
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
