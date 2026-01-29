// src/app/api/map/sites/route.ts

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await supabaseServer();
    const { data: auth } = await supabase.auth.getUser();

    // You can choose to allow unauthenticated reads,
    // but since your appShell already gates routes, we keep this consistent.
    if (!auth.user) {
      return NextResponse.json(
        { ok: false, error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('investigation_sites')
      .select('id,name,latitude,longitude,created_by,updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const rows =
      (data ?? []).map((r: any) => ({
        id: r.id,
        name: r.name,
        latitude: r.latitude,
        longitude: r.longitude,
        isOwner: r.created_by === auth.user!.id
      })) ?? [];

    return NextResponse.json({ ok: true, data: { rows } });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: { message: e?.message ?? 'Map sites fetch failed' } },
      { status: 500 }
    );
  }
}
