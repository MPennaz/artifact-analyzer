// src/components/app-shell/app-shell-sidebar.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function NavButton({
  href,
  label,
  active
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Button
      asChild
      variant={active ? 'default' : 'secondary'}
      className="w-full justify-start"
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function AppShellSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
        <div className="text-xs font-semibold text-neutral-300">NAV</div>
        <div className="mt-3 space-y-2">
          <NavButton
            href="/sites"
            label="Investigation Sites"
            active={pathname?.startsWith('/sites') ?? false}
          />
          <NavButton
            href="/digs"
            label="Dig Locations"
            active={pathname?.startsWith('/digs') ?? false}
          />
          <NavButton
            href="/records"
            label="Detail Records"
            active={pathname?.startsWith('/records') ?? false}
          />
          <Separator className="my-2 bg-neutral-800" />
          <NavButton
            href="/map"
            label="Map"
            active={pathname?.startsWith('/map') ?? false}
          />
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
        <div className="text-xs font-semibold text-neutral-300">ACTIONS</div>
        <div className="mt-3 space-y-2">
          <Button className="w-full justify-start">+ New Site</Button>
          <Button className="w-full justify-start" variant="outline">
            + New Dig Location
          </Button>
          <Button className="w-full justify-start" variant="outline">
            + New Record
          </Button>
        </div>
      </div>
    </div>
  );
}
