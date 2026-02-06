// src/features/map/components/map-details-panel.tsx

'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';

import { MapDetailsTable, type ArtifactRow } from './map-details-table';
import { getDemoSiteById } from '@/features/map/testData';
import { Button } from '@/components/ui/button';
import { MapAiModal } from './map-ai-modal';

function toArtifactRow(r: {
  id: string;
  title: string;
  notes: string;
  recordedAt: string;
  imageUrl?: string | null;
}): ArtifactRow {
  return {
    id: r.id,
    title: r.title,
    notes: r.notes,
    recordedAt: r.recordedAt,
    imageUrl: r.imageUrl ?? null
  };
}

export function MapDetailsPanel({
  siteId,
  siteName
}: {
  siteId: string | null;
  siteName?: string | null;
}) {
  const site = React.useMemo(() => getDemoSiteById(siteId), [siteId]);
  const [aiOpen, setAiOpen] = React.useState(false);

  // Empty state: nothing selected yet
  if (!siteId) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <div className="text-sm font-semibold text-neutral-300">Artifacts</div>
        <div className="mt-2 text-sm text-neutral-400">
          Select a site marker to see artifacts found.
        </div>

        <div className="mt-4 text-xs text-neutral-500">
          Demo mode: click one of the 3 site pins.
        </div>
      </div>
    );
  }

  // Selected, but not one of the demo sites
  if (!site) {
    const label = siteName?.trim() ? siteName.trim() : 'Selected Site';

    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <div className="text-sm font-semibold text-neutral-300">
          Artifacts Found
        </div>
        <div className="mt-1 text-xs text-neutral-400">{label}</div>

        <div className="mt-2 text-sm text-neutral-400">
          No demo data found for this site yet.
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          (This will later pull from{' '}
          <span className="font-mono">detail_records</span>.)
        </div>

        <div className="mt-4">
          <MapDetailsTable
            rows={[
              {
                id: 'demo-fallback',
                title: 'Demo artifact',
                notes: 'Replace with real detail_records query later.',
                recordedAt: new Date().toISOString(),
                imageUrl: null
              }
            ]}
          />
        </div>
      </div>
    );
  }

  const rows: ArtifactRow[] = site.records.map((r) =>
    toArtifactRow({
      id: r.id,
      title: r.title,
      notes: `${r.artifactType} • ${r.estimatedAge}\n${r.notes}`,
      recordedAt: r.recordedAt,
      imageUrl: r.imageUrl
    })
  );

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-300">
            Artifacts Found
          </div>
          <div className="text-xs text-neutral-400 truncate">{site.name}</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setAiOpen(true)}
            className="bg-fuchsia-600 text-white hover:bg-fuchsia-500"
            title="Open AI Insights"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
          </Button>

          <div className="text-xs text-neutral-400 whitespace-nowrap">
            {rows.length} items
          </div>
        </div>
      </div>

      <div className="mt-3">
        <MapDetailsTable rows={rows} />
      </div>

      <MapAiModal
        open={aiOpen}
        onOpenChange={setAiOpen}
        siteName={site.name}
        ai={site.ai}
      />
    </div>
  );
}

