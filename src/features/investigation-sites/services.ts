// src/features/investigation-sites/services.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import { investigationSitesRepo } from '@/lib/db/repositories/investigation-sites.repo';
import type {
  SitesListRequest,
  SiteRow,
  SiteCreateInput,
  SitePatchInput
} from './types';

function toDto(row: any, userId: string): SiteRow {
  return {
    ...row,
    isOwner: row.created_by === userId
  };
}

export const investigationSitesServices = {
  async list(input: { sb: SupabaseClient; userId: string; q: SitesListRequest }) {
    const { sb, userId, q } = input;
    const res = await investigationSitesRepo.list({ sb, userId, q });

    return {
      rows: res.rows.map((r) => toDto(r, userId)),
      total: res.total
    };
  },

  async getById(input: { sb: SupabaseClient; userId: string; siteId: string }) {
    const { sb, userId, siteId } = input;
    const row = await investigationSitesRepo.getById({ sb, siteId });
    return row ? toDto(row, userId) : null;
  },

  async create(input: {
    sb: SupabaseClient;
    userId: string;
    values: SiteCreateInput;
  }) {
    const { sb, userId, values } = input;
    const row = await investigationSitesRepo.create({ sb, userId, values });
    return toDto(row, userId);
  },

  async update(input: {
    sb: SupabaseClient;
    userId: string;
    siteId: string;
    values: SitePatchInput;
  }) {
    const { sb, userId, siteId, values } = input;

    // enforce ownership
    const existing = await investigationSitesRepo.getById({ sb, siteId });
    if (!existing) throw new Error('Site not found');
    if (existing.created_by !== userId) {
      throw new Error('Read-only: only the creator can update this site.');
    }

    const row = await investigationSitesRepo.update({ sb, siteId, values });
    return toDto(row, userId);
  },

  async remove(input: {
    sb: SupabaseClient;
    userId: string;
    siteId: string;
  }) {
    const { sb, userId, siteId } = input;

    // enforce ownership
    const existing = await investigationSitesRepo.getById({ sb, siteId });
    if (!existing) throw new Error('Site not found');
    if (existing.created_by !== userId) {
      throw new Error('Read-only: only the creator can delete this site.');
    }

    await investigationSitesRepo.remove({ sb, siteId });
    return true;
  }
};
