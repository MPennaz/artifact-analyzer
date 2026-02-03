// src/features/map/components/map-details-table.tsx

'use client';

import * as React from 'react';

export type ArtifactRow = {
  id: string;
  title: string;
  notes: string | null;
  recordedAt: string | null;
  imageUrl: string | null; // later: Supabase Storage public URL
};

function fmtDate(s: string | null) {
  if (!s) return '—';
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? s : d.toLocaleString();
}

export function MapDetailsTable({ rows }: { rows: ArtifactRow[] }) {
  if (!rows.length) {
    return <div className="text-sm text-neutral-400">No artifacts yet.</div>;
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div
          key={r.id}
          className="rounded-md border border-neutral-800 p-3"
        >
          <div className="flex gap-3">
            {/* image stub */}
            <div className="h-14 w-14 rounded bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
              img
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-neutral-100 truncate">
                {r.title}
              </div>
              <div className="text-xs text-neutral-400">{fmtDate(r.recordedAt)}</div>
              <div className="mt-1 text-sm text-neutral-300">
                {r.notes ?? '—'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
