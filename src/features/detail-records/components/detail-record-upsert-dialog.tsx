// src/features/detail-records/components/detail-record-upsert-dialog.tsx

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

import type { DetailRecordRow } from '../types';
import {
  DetailRecordCreateSchema,
  DetailRecordPatchSchema
} from '../schemas/detail-record.schema';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: DetailRecordRow | null;
  onSaved: () => void;

  /** Optional defaults used only when creating (initial === null). */
  defaults?: {
    siteId?: string;
    digLocationId?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    recordedAt?: string | null;
  };
};

export function DetailRecordUpsertDialog({
  open,
  onOpenChange,
  initial,
  onSaved,
  defaults
}: Props) {
  const isEdit = !!initial;

  const [title, setTitle] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [recordedAt, setRecordedAt] = React.useState<string>(''); // datetime-local
  const [loading, setLoading] = React.useState(false);

  const [latitude, setLatitude] = React.useState<string>('');
  const [longitude, setLongitude] = React.useState<string>('');
  const [locLoading, setLocLoading] = React.useState(false);

  // These are hidden but required for create.
  const [siteId, setSiteId] = React.useState<string>('');
  const [digLocationId, setDigLocationId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;

    if (initial) {
      setTitle(initial.title ?? '');
      setNotes(initial.notes ?? '');

      setSiteId(initial.siteId ?? '');
      setDigLocationId(initial.digLocationId ?? null);

      setLatitude(initial.latitude != null ? String(initial.latitude) : '');
      setLongitude(initial.longitude != null ? String(initial.longitude) : '');

      // Convert ISO → datetime-local (YYYY-MM-DDTHH:mm)
      setRecordedAt(initial.recordedAt ? toDatetimeLocal(initial.recordedAt) : '');
      return;
    }

    // Create mode: load from defaults
    setTitle('');
    setNotes('');

    setSiteId(defaults?.siteId ?? '');
    setDigLocationId(defaults?.digLocationId ?? null);

    setLatitude(
      defaults?.latitude != null ? Number(defaults.latitude).toFixed(6) : ''
    );
    setLongitude(
      defaults?.longitude != null ? Number(defaults.longitude).toFixed(6) : ''
    );

    setRecordedAt(defaults?.recordedAt ? toDatetimeLocal(defaults.recordedAt) : '');
  }, [
    open,
    initial,
    defaults?.siteId,
    defaults?.digLocationId,
    defaults?.latitude,
    defaults?.longitude,
    defaults?.recordedAt
  ]);

  function numOrNull(v: string): number | null {
    const s = v.trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function toIsoOrNull(dtLocal: string): string | null {
    const s = dtLocal.trim();
    if (!s) return null;

    // datetime-local is treated as local time. Convert to ISO for storage.
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }

  function toDatetimeLocal(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');

    // Local time components
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());

    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
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

      setLatitude(lat.toFixed(6));
      setLongitude(lng.toFixed(6));

      toast.success('Location set from current device position.');
    } catch (err: any) {
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
        const payload = DetailRecordPatchSchema.parse({
          title,
          notes: notes.trim() ? notes : null,
          latitude: numOrNull(latitude),
          longitude: numOrNull(longitude),
          recordedAt: toIsoOrNull(recordedAt)
        });

        const res = await fetch(`/api/detail-records/${initial!.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error?.message ?? 'Update failed');

        toast.success('Record updated');
        onSaved();
      } else {
        const payload = DetailRecordCreateSchema.parse({
          siteId,
          digLocationId,
          title,
          notes: notes.trim() ? notes : null,
          latitude: numOrNull(latitude),
          longitude: numOrNull(longitude),
          recordedAt: toIsoOrNull(recordedAt)
        });

        const res = await fetch('/api/detail-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error?.message ?? 'Create failed');

        toast.success('Record created');
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

  const disableSave = loading || locLoading || (!isEdit && !siteId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-neutral-800 bg-neutral-950 text-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Record' : 'New Record'}</DialogTitle>
        </DialogHeader>

        {/* Hidden context (still kept in state) */}
        {!isEdit && !siteId ? (
          <div className="rounded-md border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-200">
            Missing <span className="font-mono">siteId</span>. This dialog should be opened
            from a Site context (or pass defaults.siteId).
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Recorded At</Label>
            <Input
              type="datetime-local"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
            />
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
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
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

          <Button type="button" onClick={save} disabled={disableSave}>
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
