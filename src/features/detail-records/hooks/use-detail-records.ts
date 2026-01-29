// src/features/detail-records/hooks/use-detail-records.ts
'use client';

import * as React from 'react';
import type {
  DetailRecordsListRequest,
  DetailRecordsListResponse
} from '../types';

export function useDetailRecordsList(q: DetailRecordsListRequest) {
  const [data, setData] = React.useState<DetailRecordsListResponse>({
    rows: [],
    total: 0
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/detail-records/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(q)
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? 'Failed to load records');

      setData(json.data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [q]);

  React.useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, refresh: load };
}
