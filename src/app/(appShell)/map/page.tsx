// src/app/(appShell)/map/page.tsx

import { SitesMap } from '@/features/map/components/sites-map';

export default function MapPage() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Map</h1>
      <p className="text-sm text-muted-foreground">
        Click a site’s coordinates in the Sites table to jump here centered on that site.
      </p>

      <SitesMap />
    </main>
  );
}
