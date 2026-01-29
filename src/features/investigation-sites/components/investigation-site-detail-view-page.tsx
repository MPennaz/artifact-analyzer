// src/features/investigation-sites/components/investigation-site-detail-view-page.tsx

'use client';

import * as React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { DetailRecordsPanel } from '@/features/detail-records/components/detail-records-panel';

export function InvestigationSiteDetailViewPage({ siteId }: { siteId: string }) {
  // Stub: later we’ll load site header info via GET /api/investigation-sites/[siteId]
  // For now, just render the records panel scoped to this site.

  return (
    <div className="space-y-4">
      <Card className="border-neutral-800 bg-neutral-950">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Site Detail</CardTitle>
            <div className="text-sm text-neutral-400 font-mono">{siteId}</div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => history.back()}>
              Back
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <DetailRecordsPanel siteId={siteId} />
        </CardContent>
      </Card>
    </div>
  );
}
