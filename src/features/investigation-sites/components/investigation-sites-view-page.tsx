// src/features/investigation-sites/components/investigation-sites-view-page.tsx
'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  RefreshCw,
  Plus,
  Sparkles,
  Search,
  MapPin,
  Info,
  ShieldCheck
} from 'lucide-react';

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

    const res = await fetch(`/api/investigation-sites/${row.id}`, {
      method: 'DELETE'
    });
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
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* left header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200">
                <MapPin className="h-4 w-4" />
              </div>

              <div>
                <CardTitle className="flex items-center gap-2">
                  Investigation Sites
                  <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-[11px] font-medium text-fuchsia-200">
                    <Sparkles className="h-3.5 w-3.5" />
                    Demo Mode
                  </span>
                </CardTitle>

                <div className="text-sm text-neutral-400">
                  {loading ? 'Loading…' : `${total} total`}
                </div>
              </div>
            </div>
          </div>

          {/* right actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={refresh}
              disabled={loading}
              className="border-neutral-800 bg-neutral-950 hover:bg-neutral-900/60"
            >
              <RefreshCw className={['mr-2 h-4 w-4', loading ? 'animate-spin' : ''].join(' ')} />
              Refresh
            </Button>

            <Button
              onClick={() => {
                setEditRow(null);
                setOpenUpsert(true);
              }}
              className="bg-fuchsia-600/90 hover:bg-fuchsia-600 text-white"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <Plus className="mr-2 h-4 w-4" />
              New Site
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* toolbar */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search sites…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-neutral-800 bg-neutral-950"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Info className="h-4 w-4 text-fuchsia-200" />
              Click coordinates to jump to the map
              <span className="mx-1 text-neutral-600">•</span>
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Owner can edit/delete
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

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
