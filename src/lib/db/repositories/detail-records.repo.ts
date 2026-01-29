// src/lib/db/repositories/detail-records.repo.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  DetailRecordsListRequest,
  DetailRecordCreateInput,
  DetailRecordPatchInput
} from '@/features/detail-records/schemas/detail-record.schema';

type DbDetailRecord = any; // DB-shaped row; service maps to DTO later

const ORDER_BY_MAP = {
  updated_at: 'updated_at',
  created_at: 'created_at',
  recorded_at: 'recorded_at',
  title: 'title'
} as const;

type OrderByKey = keyof typeof ORDER_BY_MAP;

function escapeOrFilter(s: string) {
  // PostgREST .or() uses comma as separator; keep this safe-ish
  return s.replaceAll(',', ' ').trim();
}

export const detailRecordsRepo = {
  async list(input: {
    sb: SupabaseClient;
    userId: string;
    q: DetailRecordsListRequest;
  }): Promise<{ rows: DbDetailRecord[]; total: number }> {
    const { sb, userId, q } = input;

    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 25;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const orderBy: OrderByKey = (q.orderBy ?? 'updated_at') as OrderByKey;
    const orderDir = q.orderDir ?? 'desc';

    let query = sb
      .from('detail_records')
      .select('*', { count: 'exact' });

    if (q.siteId) query = query.eq('site_id', q.siteId);
    if (q.digLocationId) query = query.eq('dig_location_id', q.digLocationId);

    if (q.ownerOnly) query = query.eq('created_by', userId);

    if (q.search?.trim()) {
      const s = escapeOrFilter(q.search.trim());
      // Search title + notes
      query = query.or(`title.ilike.%${s}%,notes.ilike.%${s}%`);
    }

    query = query
      .order(ORDER_BY_MAP[orderBy], { ascending: orderDir === 'asc' })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { rows: data ?? [], total: count ?? 0 };
  },

  async getById(input: {
    sb: SupabaseClient;
    recordId: string;
  }): Promise<DbDetailRecord | null> {
    const { sb, recordId } = input;

    const { data, error } = await sb
      .from('detail_records')
      .select('*')
      .eq('id', recordId)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  },

  async create(input: {
    sb: SupabaseClient;
    userId: string;
    values: DetailRecordCreateInput;
  }): Promise<DbDetailRecord> {
    const { sb, userId, values } = input;

    const insertRow = {
      site_id: values.siteId,
      dig_location_id: values.digLocationId ?? null,
      title: values.title,
      notes: values.notes ?? null,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
      recorded_at: values.recordedAt ?? null,
      created_by: userId
    };

    const { data, error } = await sb
      .from('detail_records')
      .insert(insertRow)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(input: {
    sb: SupabaseClient;
    recordId: string;
    values: DetailRecordPatchInput;
  }): Promise<DbDetailRecord> {
    const { sb, recordId, values } = input;

    // Only include keys that were actually provided
    const patchRow: Record<string, any> = {};

    if (values.siteId !== undefined) patchRow.site_id = values.siteId;
    if (values.digLocationId !== undefined) patchRow.dig_location_id = values.digLocationId;

    if (values.title !== undefined) patchRow.title = values.title;
    if (values.notes !== undefined) patchRow.notes = values.notes;

    if (values.latitude !== undefined) patchRow.latitude = values.latitude;
    if (values.longitude !== undefined) patchRow.longitude = values.longitude;

    if (values.recordedAt !== undefined) patchRow.recorded_at = values.recordedAt;

    const { data, error } = await sb
      .from('detail_records')
      .update(patchRow)
      .eq('id', recordId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async remove(input: {
    sb: SupabaseClient;
    recordId: string;
  }): Promise<boolean> {
    const { sb, recordId } = input;

    const { error } = await sb
      .from('detail_records')
      .delete()
      .eq('id', recordId);

    if (error) throw error;
    return true;
  }
};
