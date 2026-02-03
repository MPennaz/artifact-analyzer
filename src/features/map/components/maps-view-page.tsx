// src/features/map/components/map-view-page.tsx

'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import { SitesMap } from './sites-map';
import { MapDetailsPanel } from './map-details-panel';

export type MapSelectableSite = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
};

export function MapsViewPage() {
  const sp = useSearchParams();
  const router = useRouter();

  // allow preselect via /map?siteId=...
  const initialSiteId = sp.get('siteId') ?? undefined;

  const [selectedSiteId, setSelectedSiteId] = React.useState<string | undefined>(
    initialSiteId
  );

  // keep selection in sync if user navigates via links with querystring
  React.useEffect(() => {
    if (initialSiteId) setSelectedSiteId(initialSiteId);
  }, [initialSiteId]);

  function handleSelectSite(site: MapSelectableSite) {
    setSelectedSiteId(site.id);

    // optional: keep URL in sync so the details panel is linkable
    const qs = new URLSearchParams(sp.toString());
    qs.set('siteId', site.id);
    if (site.latitude != null) qs.set('lat', String(site.latitude));
    if (site.longitude != null) qs.set('lng', String(site.longitude));
    qs.set('name', site.name);

    router.replace(`/map?${qs.toString()}`);
  }

  return (
    <div className="flex gap-6">
      {/* left: map */}
      <div className="flex-1 min-w-0">
        <SitesMap
          selectedSiteId={selectedSiteId}
          onSelectSite={handleSelectSite}
        />
      </div>

      {/* right: details */}
      <div className="w-[420px] shrink-0">
        <MapDetailsPanel siteId={selectedSiteId ?? null} />
      </div>
    </div>
  );
}
