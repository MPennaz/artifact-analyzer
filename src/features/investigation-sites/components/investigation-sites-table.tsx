// src/features/investigation-sites/components/investigation-sites-table.tsx

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { SiteRow } from '../types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, MapPin, Crown, Eye } from 'lucide-react';

function formatCoord(n: number | null | undefined) {
  if (n == null) return '—';
  return n.toFixed(5);
}

function CoordPill({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Open on map"
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        'font-mono text-xs',
        'cursor-pointer select-none',
        'border-sky-500/30 bg-sky-500/10 text-sky-200',
        'hover:bg-sky-500/20 hover:border-sky-400/50 hover:text-sky-100',
        'active:scale-[0.99] transition'
      ].join(' ')}
    >
      <MapPin className="h-3.5 w-3.5" />
      <span className="underline underline-offset-4 decoration-sky-400/50">
        {label}
      </span>
    </button>
  );
}

function AccessPill({ isOwner }: { isOwner: boolean }) {
  if (isOwner) {
    return (
      <span
        className={[
          'inline-flex items-center gap-2 rounded-full border px-3 py-1',
          'text-xs font-semibold',
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
        ].join(' ')}
        title="You created this site"
      >
        <Crown className="h-3.5 w-3.5" />
        Owner
      </span>
    );
  }

  return (
    <span
      className={[
        'inline-flex items-center gap-2 rounded-full border px-3 py-1',
        'text-xs font-semibold',
        'border-violet-500/30 bg-violet-500/10 text-violet-200'
      ].join(' ')}
      title="You can view, but not edit"
    >
      <Eye className="h-3.5 w-3.5" />
      Read-only
    </span>
  );
}

export function InvestigationSitesTable({
  rows,
  loading,
  onEdit,
  onDelete
}: {
  rows: SiteRow[];
  loading: boolean;
  onEdit: (row: SiteRow) => void;
  onDelete: (row: SiteRow) => void;
}) {
  const router = useRouter();

  function jumpToMap(r: SiteRow) {
    if (r.latitude == null || r.longitude == null) return;

    const qs = new URLSearchParams({
      lat: String(r.latitude),
      lng: String(r.longitude),
      siteId: r.id,
      name: r.name
    });

    router.push(`/map?${qs.toString()}`);
  }

  return (
    <div className="rounded-lg border border-neutral-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead>Access</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-sm text-neutral-400">
                Loading…
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-sm text-neutral-400">
                No sites yet. Create one to get started.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => {
              const hasLoc = r.latitude != null && r.longitude != null;

              return (
                <TableRow
                  key={r.id}
                  className={[
                    'hover:bg-neutral-900/50 transition',
                    'data-[state=selected]:bg-neutral-900/60'
                  ].join(' ')}
                >
                  <TableCell className="font-medium">{r.name}</TableCell>

                  <TableCell className="hidden md:table-cell text-neutral-400">
                    {r.description ?? '—'}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {hasLoc ? (
                      <CoordPill
                        label={`${formatCoord(r.latitude)}, ${formatCoord(r.longitude)}`}
                        onClick={() => jumpToMap(r)}
                      />
                    ) : (
                      <span className="text-sm text-neutral-500">—</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <AccessPill isOwner={!!r.isOwner} />
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(r)}
                        disabled={!r.isOwner}
                        title={r.isOwner ? 'Edit' : 'Read-only'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(r)}
                        disabled={!r.isOwner}
                        title={r.isOwner ? 'Delete' : 'Read-only'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
