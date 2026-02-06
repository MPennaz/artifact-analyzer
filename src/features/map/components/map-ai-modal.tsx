'use client';

import * as React from 'react';
import { Sparkles, MapPin, Shapes, Hourglass, Route } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type MapAiOutputs = {
  masterSummary: string;
  locationAgent: string;
  artifactAgent: string;
  ageAgent: string;
  suggestedNextSites: string[];
};

export function MapAiModal({
  open,
  onOpenChange,
  siteName,
  ai
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteName: string;
  ai: MapAiOutputs;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999] max-w-2xl border-neutral-800 bg-neutral-950">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-fuchsia-400" />
            AI Insights
            <Badge className="ml-2 bg-fuchsia-500/15 text-fuchsia-200 border border-fuchsia-500/30">
              Demo
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            Site: <span className="text-neutral-200 font-medium">{siteName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg border border-fuchsia-500/25 bg-fuchsia-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-fuchsia-200">
              <Sparkles className="h-4 w-4" />
              Master Summary
            </div>
            <p className="mt-2 text-sm text-neutral-200 leading-relaxed">
              {ai.masterSummary}
            </p>
          </div>

          {/* 3-column-ish blocks */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Location Analysis
              </div>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {ai.locationAgent}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                <Shapes className="h-4 w-4 text-sky-300" />
                Artifact Analysis
              </div>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {ai.artifactAgent}
              </p>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 md:col-span-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                <Hourglass className="h-4 w-4 text-amber-300" />
                Age Estimation
              </div>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {ai.ageAgent}
              </p>
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-violet-200">
              <Route className="h-4 w-4 text-violet-300" />
              Suggested Next Steps
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {ai.suggestedNextSites.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              className="border-neutral-800"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
