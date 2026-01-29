// src/features/detail-records/components/detail-records-table.tsx

'use client';

import * as React from 'react';
import type { DetailRecordRow } from '../types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

export function DetailRecordsTable({
  rows,
  loading,
  onEdit,
  onDelete
}: {
  rows: DetailRecordRow[];
  loading: boolean;
  onEdit: (row: DetailRecordRow) => void;
  onDelete: (row: DetailRecordRow) => void;
}) {
  return (
    <div className="rounded-lg border border-neutral-800">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Recorded</TableHead>
            <TableHead className="hidden lg:table-cell">Location</TableHead>
            <TableHead className="w-[140px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-sm text-neutral-400">
                Loading…
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-sm text-neutral-400">
                No records yet.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => {
              const hasLoc = r.latitude != null && r.longitude != null;

              return (
                <TableRow key={r.id} className="hover:bg-neutral-900/40">
                  <TableCell className="font-medium">{r.title}</TableCell>

                  <TableCell className="hidden md:table-cell text-neutral-400">
                    {r.recordedAt ?? '—'}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell text-neutral-400 font-mono text-xs">
                    {hasLoc ? `${r.latitude}, ${r.longitude}` : '—'}
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
