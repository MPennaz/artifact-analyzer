// src/app/(appShell)/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Pickaxe,
  ListChecks,
  Brain,
  Wand2
} from 'lucide-react';

function StatPill({
  icon: Icon,
  label,
  value,
  hint
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-neutral-300">
          <span className="grid h-8 w-8 place-items-center rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200">
            <Icon className="h-4 w-4" />
          </span>
          <span className="font-medium">{label}</span>
        </div>
        <div className="text-xl font-semibold text-neutral-100">{value}</div>
      </div>
      <div className="mt-2 text-xs text-neutral-500">{hint}</div>
    </div>
  );
}

function QuickLink({
  href,
  title,
  desc,
  icon: Icon,
  badge
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-neutral-800 bg-neutral-950 p-5 transition hover:bg-neutral-900/60"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-200 transition group-hover:scale-[1.02]">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-neutral-100">{title}</div>
              {badge ? (
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                  {badge}
                </Badge>
              ) : null}
            </div>
            <div className="mt-1 text-sm text-neutral-400">{desc}</div>
          </div>
        </div>

        <ArrowRight className="h-5 w-5 text-neutral-600 transition group-hover:translate-x-0.5 group-hover:text-neutral-300" />
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 p-6">
        {/* background glow */}
        <div className="pointer-events-none absolute -top-24 right-[-140px] h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-[-160px] h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-200">
              <Sparkles className="h-4 w-4" />
              Artifact Analyzer • Demo Ready
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
              Welcome back
            </h1>

            <p className="max-w-2xl text-sm text-neutral-400">
              Pick a section to explore sites, digs, and records — or jump straight
              to the map to show the “AI Insights” demo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild className="bg-fuchsia-600/90 hover:bg-fuchsia-600 text-white">
              <Link href="/map">
                <MapPin className="mr-2 h-4 w-4" />
                Open Map Demo
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-neutral-800 bg-neutral-950 hover:bg-neutral-900/60"
            >
              <Link href="/sites">
                <Wand2 className="mr-2 h-4 w-4" />
                Manage Sites
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats (hardcoded for demo) */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <StatPill
          icon={MapPin}
          label="Sites"
          value="3"
          hint="Three historic locations loaded for judging."
        />
        <StatPill
          icon={Pickaxe}
          label="Dig Locations"
          value="6"
          hint="Mock excavation points around each site."
        />
        <StatPill
          icon={ListChecks}
          label="Detail Records"
          value="18"
          hint="Artifacts with photos + notes for the detail panel."
        />
        <StatPill
          icon={Brain}
          label="AI Insights"
          value="Ready"
          hint="Click “AI Insights” on the map detail panel."
        />
      </div>

      {/* Quick links */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-neutral-800 bg-neutral-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-neutral-100">
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <QuickLink
              href="/map"
              title="Map View + Details"
              desc="Click pins to see artifacts and open the AI Insights modal."
              icon={MapPin}
              badge="Best Demo"
            />
            <QuickLink
              href="/sites"
              title="Investigation Sites"
              desc="Create/edit sites and jump to the map from coordinates."
              icon={Wand2}
            />
            <QuickLink
              href="/digs"
              title="Dig Locations"
              desc="Track where digging happened at each site."
              icon={Pickaxe}
            />
            <QuickLink
              href="/records"
              title="Detail Records"
              desc="Log artifacts, photos, coordinates, and notes."
              icon={ListChecks}
            />
          </CardContent>
        </Card>

        {/* Demo tips */}
        <Card className="border-neutral-800 bg-neutral-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-neutral-100">
              5-Minute Demo Script
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-neutral-400">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
              <div className="font-medium text-neutral-200">
                Suggested flow
              </div>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>
                  Open <span className="text-neutral-200">Map</span> and click a
                  pin (Mitchell / Slant / Cahokia).
                </li>
                <li>
                  Show the right-side artifacts list with images + coordinates.
                </li>
                <li>
                  Click <span className="text-neutral-200">AI Insights</span>{' '}
                  to pop the modal with the summary + next steps.
                </li>
                <li>
                  Mention: “Real version will generate these from uploaded
                  evidence / notes.”
                </li>
              </ol>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="border-sky-500/30 bg-sky-500/10 text-sky-200">
                Kid-friendly UI
              </Badge>
              <Badge className="border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200">
                Storytelling
              </Badge>
              <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-200">
                Fast clicks
              </Badge>
            </div>

            <div className="text-xs text-neutral-500">
              Tip: If you want the counts to be dynamic later, we can fetch them
              from the real APIs — but hardcoded is perfect for judging.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
