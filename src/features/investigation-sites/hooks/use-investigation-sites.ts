// src/features/investigation-sites/hooks/use-investigation-sites.ts

'use client';

import * as React from 'react';
import type { SitesListRequest, SiteRow } from '../types';

type ListResult = { rows: SiteRow[]; total: number };

export function useInvestigationSitesList(q: SitesListRequest) {
  const [data, setData] = React.useState<ListResult>({ rows: [], total: 0 });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/investigation-sites/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q)
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? 'Failed to load sites');

      setData(json.data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load sites');
    } finally {
      setLoading(false);
    }
  }, [q]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, refresh: load };
}
