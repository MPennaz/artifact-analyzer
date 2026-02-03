// src/features/map/components/map-details-panel.tsx

'use client';

import * as React from 'react';
import { MapDetailsTable, type ArtifactRow } from './map-details-table';

const MOCK: Record<string, { siteName: string; rows: ArtifactRow[] }> = {
  // Replace these IDs with real site UUIDs later if you want
  'demo-site-1': {
    siteName: 'Cahokia',
    rows: [
      {
        id: 'a1',
        title: 'Pottery shard',
        notes: 'Near the berm; shallow depth.',
        recordedAt: '2026-02-02T10:30:00Z',
        imageUrl: null
      },
      {
        id: 'a2',
        title: 'Stone tool fragment',
        notes: 'Found ~20ft north of marker.',
        recordedAt: '2026-02-02T11:05:00Z',
        imageUrl: null
      }
    ]
  },
  'demo-site-2': {
    siteName: 'Site B',
    rows: [
      {
        id: 'b1',
        title: 'Metal ring',
        notes: 'Oxidized; bagged for review.',
        recordedAt: '2026-02-01T15:10:00Z',
        imageUrl: null
      }
    ]
  },
  'demo-site-3': {
    siteName: 'Site C',
    rows: [
      {
        id: 'c1',
        title: 'Bone fragment',
        notes: 'Possible animal; needs lab check.',
        recordedAt: '2026-01-30T09:20:00Z',
        imageUrl: null
      },
      {
        id: 'c2',
        title: 'Glass piece',
        notes: 'Likely modern; still documented.',
        recordedAt: '2026-01-30T10:12:00Z',
        imageUrl: null
      }
    ]
  }
};

function pickFallback(siteId: string | null) {
  if (!siteId) return null;
  // If selection isn’t one of the demo IDs, still show something
  return (
    MOCK[siteId] ??
    {
      siteName: 'Selected Site',
      rows: [
        {
          id: 'x1',
          title: 'Demo artifact',
          notes: 'Replace with real detail_records query later.',
          recordedAt: new Date().toISOString(),
          imageUrl: null
        }
      ]
    }
  );
}

export function MapDetailsPanel({ siteId }: { siteId: string | null }) {
  const data = React.useMemo(() => pickFallback(siteId), [siteId]);

  if (!siteId) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <div className="text-sm text-neutral-300 font-semibold">Artifacts</div>
        <div className="mt-2 text-sm text-neutral-400">
          Select a site marker to see artifacts found.
        </div>

        {/* demo picker */}
        <div className="mt-4 space-y-2 text-sm">
          <div className="text-neutral-400">Demo selections:</div>
          <ul className="list-disc pl-5 text-neutral-300">
            <li>demo-site-1</li>
            <li>demo-site-2</li>
            <li>demo-site-3</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-neutral-300 font-semibold">
            Artifacts Found
          </div>
          <div className="text-xs text-neutral-400">
            {data?.siteName ?? 'Site'}
          </div>
        </div>
        <div className="text-xs text-neutral-400">
          {data?.rows.length ?? 0} items
        </div>
      </div>

      <div className="mt-3">
        <MapDetailsTable rows={data?.rows ?? []} />
      </div>

      {/* later: buttons like “Add artifact”, “Upload photo”, etc */}
    </div>
  );
}
