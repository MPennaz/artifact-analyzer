// src/features/detail-records/components/detail-records-panel.tsx

'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus } from 'lucide-react';

import { useDetailRecordsList } from '../hooks/use-detail-records';
import type { DetailRecordRow } from '../types';
import { DetailRecordsTable } from './detail-records-table';

// TODO: you’ll create this next (upsert dialog)
function PlaceholderUpsertDialog(_props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: DetailRecordRow | null;
  siteId: string;
  onSaved: () => void;
}) {
  return null;
}

export function DetailRecordsPanel({ siteId }: { siteId: string }) {
  const [search, setSearch] = React.useState('');
  const [openUpsert, setOpenUpsert] = React.useState(false);
  const [editRow, setEditRow] = React.useState<DetailRecordRow | null>(null);

  const q = React.useMemo(
    () => ({
      page: 1,
      pageSize: 25,
      siteId,
      search: search.trim() ? search.trim() : undefined,
      orderBy: 'updated_at' as const,
      orderDir: 'desc' as const
    }),
    [siteId, search]
  );

  const { rows, total, loading, error, refresh } = useDetailRecordsList(q);

  async function handleDelete(row: DetailRecordRow) {
    if (!row.isOwner) {
      toast.error('Read-only: only the creator can delete this record.');
      return;
    }

    const ok = confirm(`Delete record "${row.title}"?`);
    if (!ok) return;

    const res = await fetch(`/api/detail-records/${row.id}`, { method: 'DELETE' });
    const json = await res.json();

    if (!json.ok) {
      toast.error(json.error?.message ?? 'Delete failed');
      return;
    }

    toast.success('Record deleted');
    refresh();
  }

  return (
    <Card className="border-neutral-800 bg-neutral-950">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Detail Records</CardTitle>
          <div className="text-sm text-neutral-400">
            {loading ? 'Loading…' : `${total} total`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={() => {
              setEditRow(null);
              setOpenUpsert(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Record
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search records…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {error ? <div className="text-sm text-red-400">{error}</div> : null}

        <DetailRecordsTable
          rows={rows}
          loading={loading}
          onEdit={(row) => {
            if (!row.isOwner) {
              toast.error('Read-only: only the creator can edit this record.');
              return;
            }
            setEditRow(row);
            setOpenUpsert(true);
          }}
          onDelete={handleDelete}
        />
      </CardContent>

      <PlaceholderUpsertDialog
        open={openUpsert}
        onOpenChange={setOpenUpsert}
        initial={editRow}
        siteId={siteId}
        onSaved={() => {
          setOpenUpsert(false);
          setEditRow(null);
          refresh();
        }}
      />
    </Card>
  );
}
