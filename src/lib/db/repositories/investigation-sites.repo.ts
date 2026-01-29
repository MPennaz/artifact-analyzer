// src/lib/db/repositories/investigation-sites.repo.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  SitesListRequest,
  SiteCreateInput,
  SitePatchInput,
  SiteRowDb
} from '@/features/investigation-sites/types';

const ORDER_BY_MAP = {
  updated_at: 'updated_at',
  created_at: 'created_at',
  name: 'name'
} as const;

type OrderByKey = keyof typeof ORDER_BY_MAP;

export const investigationSitesRepo = {
  async list(input: { sb: SupabaseClient; userId: string; q: SitesListRequest }) {
    const { sb, userId, q } = input;

    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 25;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const orderBy = (q.orderBy ?? 'updated_at') as OrderByKey;
    const orderDir = q.orderDir ?? 'desc';

    let query = sb
      .from('investigation_sites')
      .select('*', { count: 'exact' })
      .order(ORDER_BY_MAP[orderBy], { ascending: orderDir === 'asc' })
      .range(from, to);

    if (q.search) {
      // simple ilike on name + description
      // NOTE: Supabase OR syntax: or('a.ilike.%x%,b.ilike.%x%')
      const s = q.search.replace(/%/g, '\\%');
      query = query.or(`name.ilike.%${s}%,description.ilike.%${s}%`);
    }

    if (q.ownerOnly) {
      query = query.eq('created_by', userId);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return {
      rows: (data ?? []) as SiteRowDb[],
      total: count ?? 0
    };
  },

  async getById(input: { sb: SupabaseClient; siteId: string }) {
    const { sb, siteId } = input;
    const { data, error } = await sb
      .from('investigation_sites')
      .select('*')
      .eq('id', siteId)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as SiteRowDb | null;
  },

  async create(input: { sb: SupabaseClient; userId: string; values: SiteCreateInput }) {
    const { sb, userId, values } = input;

    const payload = {
      name: values.name,
      description: values.description ?? null,
      latitude: values.latitude ?? null,
      longitude: values.longitude ?? null,
      created_by: userId
    };

    const { data, error } = await sb
      .from('investigation_sites')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data as SiteRowDb;
  },

  async update(input: {
    sb: SupabaseClient;
    siteId: string;
    values: SitePatchInput;
  }) {
    const { sb, siteId, values } = input;

    const payload: any = {};
    if (values.name !== undefined) payload.name = values.name;
    if (values.description !== undefined) payload.description = values.description;
    if (values.latitude !== undefined) payload.latitude = values.latitude;
    if (values.longitude !== undefined) payload.longitude = values.longitude;

    const { data, error } = await sb
      .from('investigation_sites')
      .update(payload)
      .eq('id', siteId)
      .select('*')
      .single();

    if (error) throw error;
    return data as SiteRowDb;
  },

  async remove(input: { sb: SupabaseClient; siteId: string }) {
    const { sb, siteId } = input;
    const { error } = await sb.from('investigation_sites').delete().eq('id', siteId);
    if (error) throw error;
    return true;
  }
};
