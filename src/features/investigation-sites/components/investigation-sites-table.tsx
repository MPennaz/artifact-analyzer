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
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

function formatCoord(n: number | null | undefined) {
  if (n == null) return '—';
  return n.toFixed(5);
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
                <TableRow key={r.id} className="hover:bg-neutral-900/40">
                  <TableCell className="font-medium">{r.name}</TableCell>

                  <TableCell className="hidden md:table-cell text-neutral-400">
                    {r.description ?? '—'}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-neutral-400">
                    {hasLoc ? (
                      <button
                        type="button"
                        onClick={() => jumpToMap(r)}
                        className="font-mono text-xs underline underline-offset-4 hover:text-white"
                        title="Open on map"
                      >
                        {formatCoord(r.latitude)}, {formatCoord(r.longitude)}
                      </button>
                    ) : (
                      '—'
                    )}
                  </TableCell>

                  <TableCell>
                    {r.isOwner ? (
                      <Badge>Owner</Badge>
                    ) : (
                      <Badge variant="secondary">Read-only</Badge>
                    )}
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

