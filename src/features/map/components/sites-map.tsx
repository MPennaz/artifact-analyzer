// src/features/map/components/sites-map.tsx

'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  AttributionControl,
  useMapEvents
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { InvestigationSiteUpsertDialog } from '@/features/investigation-sites/components/investigation-site-upsert-dialog';

type MapSitePin = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  isOwner: boolean;
};

/* -------------------------------------------------------
   Fix Leaflet marker icons (Next.js)
------------------------------------------------------- */
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* -------------------------------------------------------
   Fit map to all pins (when no focus)
------------------------------------------------------- */
function FitAll({ points }: { points: Array<[number, number]> }) {
  const map = useMap();

  React.useEffect(() => {
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, points]);

  return null;
}

/* -------------------------------------------------------
   Focus map + open popup for siteId deep link
------------------------------------------------------- */
function FocusSite({
  site,
  markerRef
}: {
  site: { id: string; name: string; lat: number; lng: number } | null;
  markerRef: React.MutableRefObject<Record<string, L.Marker | null>>;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!site) return;

    map.setView([site.lat, site.lng], 15, { animate: true });

    const t = setTimeout(() => {
      const m = markerRef.current[site.id];
      m?.openPopup();
    }, 150);

    return () => clearTimeout(t);
  }, [map, site, markerRef]);

  return null;
}

/* -------------------------------------------------------
   Click-to-create helper (opens dialog with lat/lng)
------------------------------------------------------- */
function ClickToCreate({
  enabled,
  onPick
}: {
  enabled: boolean;
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (!enabled) return;
      onPick(e.latlng.lat, e.latlng.lng);
    }
  });

  return null;
}

export function SitesMap() {
  const sp = useSearchParams();
  const focusSiteId = sp.get('siteId');

  const [rows, setRows] = React.useState<MapSitePin[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  // Marker refs for popup control
  const markerRef = React.useRef<Record<string, L.Marker | null>>({});

  // Create-from-map dialog state
  const [createOpen, setCreateOpen] = React.useState(false);
  const [picked, setPicked] = React.useState<{ lat: number; lng: number } | null>(
    null
  );

  async function reloadPins() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/map/sites', { cache: 'no-store' });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error?.message ?? 'Failed to load pins');
      setRows(json.data.rows ?? []);
    } catch (e: any) {
      setMsg(e?.message ?? 'Failed to load pins');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    reloadPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pins = React.useMemo(() => {
    return rows
      .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
      .map((r) => ({
        ...r,
        lat: Number(r.latitude),
        lng: Number(r.longitude)
      }));
  }, [rows]);

  const points = React.useMemo<Array<[number, number]>>(
    () => pins.map((p) => [p.lat, p.lng]),
    [pins]
  );

  const focused = React.useMemo(() => {
    if (!focusSiteId) return null;
    const hit = pins.find((p) => p.id === focusSiteId);
    if (!hit) return null;
    return { id: hit.id, name: hit.name, lat: hit.lat, lng: hit.lng };
  }, [pins, focusSiteId]);

  // Default center (Minneapolis-ish)
  const defaultCenter: LatLngExpression = [44.9778, -93.265];

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-semibold">Map</h1>
        <p className="text-sm text-muted-foreground">
          {focused
            ? `Focused on: ${focused.name}`
            : 'Click anywhere on the map to create a Site at that location.'}
        </p>
      </div>

      {msg ? (
        <div className="rounded-lg border border-border bg-background p-3 text-sm">
          {msg}
        </div>
      ) : null}

      <div className="h-[70vh] w-full rounded-xl border border-border">
        <MapContainer
          center={defaultCenter}
          zoom={4}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <AttributionControl position="bottomright" prefix={false} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Click map -> create site at lat/lng */}
          <ClickToCreate
            enabled
            onPick={(lat, lng) => {
              setPicked({ lat, lng });
              setCreateOpen(true);
            }}
          />

          {/* If no focus, fit to all pins */}
          {!focused ? <FitAll points={points} /> : null}

          {/* If focusSiteId exists, center and open popup */}
          {focused ? <FocusSite site={focused} markerRef={markerRef} /> : null}

          {pins.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              ref={(ref) => {
                markerRef.current[p.id] = ref ?? null;
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs opacity-80">
                    {p.lat.toFixed(6)}, {p.lng.toFixed(6)}
                  </div>
                  <div className="text-xs">
                    {p.isOwner ? 'Owner' : 'Read-only'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {!loading && pins.length === 0 ? (
        <div className="rounded-lg border border-border bg-background p-3 text-sm text-muted-foreground">
          No sites have coordinates yet. Click the map to create one.
        </div>
      ) : null}

      {/* Create dialog opened from map click */}
      <InvestigationSiteUpsertDialog
        open={createOpen}
        onOpenChange={(o) => setCreateOpen(o)}
        initial={null}
        defaults={{
          latitude: picked?.lat ?? null,
          longitude: picked?.lng ?? null
        }}
        onSaved={async () => {
          await reloadPins();
        }}
      />
    </div>
  );
}
