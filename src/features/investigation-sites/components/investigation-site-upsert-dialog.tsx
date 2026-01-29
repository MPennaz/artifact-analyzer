// src/features/investigation-sites/components/investigation-site-upsert-dialog.tsx

'use client';

import * as React from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import type { SiteRow } from '../types';
import { SiteCreateSchema, SitePatchSchema } from '../schemas/site.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: SiteRow | null;
  onSaved: () => void;

  /** Optional defaults used only when creating (initial === null). */
  defaults?: {
    latitude?: number | null;
    longitude?: number | null;
  };
};

export function InvestigationSiteUpsertDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
  defaults
}: Props) {
  const isEdit = !!initial;

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const [latitude, setLatitude] = React.useState<string>('');
  const [longitude, setLongitude] = React.useState<string>('');
  const [locLoading, setLocLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    // Edit mode: load from initial
    if (initial) {
      setName(initial.name ?? '');
      setDescription(initial.description ?? '');
      setLatitude(initial.latitude != null ? String(initial.latitude) : '');
      setLongitude(initial.longitude != null ? String(initial.longitude) : '');
      return;
    }

    // Create mode: load from defaults (e.g., picked map coordinate)
    setName('');
    setDescription('');
    setLatitude(
      defaults?.latitude != null ? Number(defaults.latitude).toFixed(6) : ''
    );
    setLongitude(
      defaults?.longitude != null ? Number(defaults.longitude).toFixed(6) : ''
    );
  }, [open, initial, defaults?.latitude, defaults?.longitude]);

  function numOrNull(v: string): number | null {
    const s = v.trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  async function useCurrentLocation() {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported in this browser.');
      return;
    }

    setLocLoading(true);

    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // keep a sane precision for display
      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));

      toast.success('Location set from current device position.');
    } catch (err: any) {
      // Common cases: permission denied, timeout, unavailable
      const code = err?.code;
      const msg =
        code === 1
          ? 'Location permission denied.'
          : code === 2
            ? 'Location unavailable.'
            : code === 3
              ? 'Location request timed out.'
              : err?.message ?? 'Could not get current location.';
      toast.error(msg);
    } finally {
      setLocLoading(false);
    }
  }

  async function save() {
    setLoading(true);

    try {
      if (isEdit) {
        const payload = SitePatchSchema.parse({
          name,
          description: description.trim() ? description : null,
          latitude: numOrNull(latitude),
          longitude: numOrNull(longitude)
        });

        const res = await fetch(`/api/investigation-sites/${initial!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error?.message ?? 'Update failed');

        toast.success('Site updated');
        onSaved();
      } else {
        const payload = SiteCreateSchema.parse({
          name,
          description: description.trim() ? description : null,
          latitude: numOrNull(latitude),
          longitude: numOrNull(longitude)
        });

        const res = await fetch('/api/investigation-sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error?.message ?? 'Create failed');

        toast.success('Site created');
        onSaved();
      }
    } catch (e: unknown) {
      if (e instanceof z.ZodError) {
        toast.error(e.issues?.[0]?.message ?? 'Invalid input');
      } else if (e instanceof Error) {
        toast.error(e.message ?? 'Save failed');
      } else {
        toast.error('Save failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-800 bg-neutral-950 text-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Site' : 'New Site'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Latitude</Label>
              <Input
                inputMode="decimal"
                placeholder="e.g. 45.12345"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Longitude</Label>
              <Input
                inputMode="decimal"
                placeholder="e.g. -93.12345"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={useCurrentLocation}
              disabled={locLoading || loading}
            >
              {locLoading ? 'Getting location…' : 'Use current location'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setLatitude('');
                setLongitude('');
              }}
              disabled={locLoading || loading}
            >
              Clear
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || locLoading}
          >
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={loading || locLoading}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
