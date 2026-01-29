// src/features/investigation-sites/components/investigation-sites-view-page.tsx
'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Plus } from 'lucide-react';

import { useInvestigationSitesList } from '../hooks/use-investigation-sites';
import type { SiteRow } from '../types';
import { InvestigationSitesTable } from './investigation-sites-table';
import { InvestigationSiteUpsertDialog } from './investigation-site-upsert-dialog';

export function InvestigationSitesViewPage() {
  const [search, setSearch] = React.useState('');
  const [openUpsert, setOpenUpsert] = React.useState(false);
  const [editRow, setEditRow] = React.useState<SiteRow | null>(null);

  const q = React.useMemo(
    () => ({
      page: 1,
      pageSize: 25,
      search: search.trim() ? search.trim() : undefined,
      orderBy: 'updated_at' as const,
      orderDir: 'desc' as const
    }),
    [search]
  );

  const { rows, total, loading, error, refresh } = useInvestigationSitesList(q);

  async function handleDelete(row: SiteRow) {
    if (!row.isOwner) {
      toast.error('Read-only: only the creator can delete this site.');
      return;
    }

    const ok = confirm(`Delete site "${row.name}"?`);
    if (!ok) return;

    const res = await fetch(`/api/investigation-sites/${row.id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.ok) {
      toast.error(json.error?.message ?? 'Delete failed');
      return;
    }

    toast.success('Site deleted');
    refresh();
  }

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Investigation Sites</CardTitle>
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
              New Site
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search sites…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          {error ? <div className="text-sm text-red-400">{error}</div> : null}

          <InvestigationSitesTable
            rows={rows}
            loading={loading}
            onEdit={(row) => {
              if (!row.isOwner) {
                toast.error('Read-only: only the creator can edit this site.');
                return;
              }
              setEditRow(row);
              setOpenUpsert(true);
            }}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <InvestigationSiteUpsertDialog
        open={openUpsert}
        onOpenChange={setOpenUpsert}
        initial={editRow}
        onSaved={() => {
          setOpenUpsert(false);
          setEditRow(null);
          refresh();
        }}
      />
    </div>
  );
}
