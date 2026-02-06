// src/components/app-shell/app-shell-sidebar.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// lucide icons
import {
  Map as MapIcon,
  Landmark,
  Shovel,
  ClipboardList,
  ChevronRight,
  Home
} from 'lucide-react';

function NavButton({
  href,
  label,
  active,
  icon
}: {
  href: string;
  label: string;
  active: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      className={[
        'group w-full justify-start gap-3 rounded-md px-3 py-6 text-left',
        'border border-transparent',
        'hover:border-neutral-800 hover:bg-neutral-900/60',
        active
          ? 'bg-neutral-900/80 border-neutral-800 text-neutral-50 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]'
          : 'text-neutral-200'
      ].join(' ')}
    >
      <Link href={href} aria-current={active ? 'page' : undefined}>
        {/* left icon bubble */}
        <span
          className={[
            'grid h-9 w-9 place-items-center rounded-md border',
            active
              ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200'
              : 'border-neutral-800 bg-neutral-950 text-neutral-300 group-hover:text-neutral-100'
          ].join(' ')}
        >
          {icon}
        </span>

        {/* label */}
        <span className="flex-1 min-w-0">
          <span className="block truncate font-medium">{label}</span>
          <span
            className={[
              'mt-0.5 block text-[11px]',
              active
                ? 'text-neutral-300'
                : 'text-neutral-500 group-hover:text-neutral-400'
            ].join(' ')}
          >
            {active ? 'Active' : 'Open'}
          </span>
        </span>

        {/* right chevron */}
        <ChevronRight
          className={[
            'h-4 w-4 shrink-0 transition-all',
            active ? 'text-fuchsia-200 opacity-100' : 'opacity-0 group-hover:opacity-60'
          ].join(' ')}
        />
      </Link>
    </Button>
  );
}

export function AppShellSidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-3">
      {/* NAV */}
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-neutral-300">NAV</div>
        </div>

        <div className="mt-3 space-y-2">
          <NavButton
            href="/"
            label="Dashboard"
            active={pathname === '/' || pathname?.startsWith('/?') || pathname === ''}
            icon={<Home className="h-4 w-4" />}
          />

          <Separator className="my-2 bg-neutral-800" />

          <NavButton
            href="/sites"
            label="Investigation Sites"
            active={pathname?.startsWith('/sites') ?? false}
            icon={<Landmark className="h-4 w-4" />}
          />
          <NavButton
            href="/digs"
            label="Dig Locations"
            active={pathname?.startsWith('/digs') ?? false}
            icon={<Shovel className="h-4 w-4" />}
          />
          <NavButton
            href="/records"
            label="Detail Records"
            active={pathname?.startsWith('/records') ?? false}
            icon={<ClipboardList className="h-4 w-4" />}
          />

          <Separator className="my-2 bg-neutral-800" />

          <NavButton
            href="/map"
            label="Map"
            active={pathname?.startsWith('/map') ?? false}
            icon={<MapIcon className="h-4 w-4" />}
          />
        </div>

        <div className="mt-3 rounded-md border border-neutral-800 bg-neutral-900/40 p-2 text-[11px] text-neutral-400">
          Tip: open <span className="text-neutral-200">Map</span>, click a pin, then hit{' '}
          <span className="text-fuchsia-200">AI Insights</span>.
        </div>
      </div>
    </div>
  );
}
