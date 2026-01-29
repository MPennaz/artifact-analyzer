// src/features/detail-records/services.ts

import type { SupabaseClient } from '@supabase/supabase-js';
import { detailRecordsRepo } from '@/lib/db/repositories/detail-records.repo';
import type {
  DetailRecordsListRequest,
  DetailRecordRow,
  DetailRecordCreateInput,
  DetailRecordPatchInput
} from './types';

function toDto(row: any, userId: string): DetailRecordRow {
  return {
    id: row.id,

    siteId: row.site_id,
    digLocationId: row.dig_location_id ?? null,

    title: row.title,
    notes: row.notes ?? null,

    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,

    recordedAt: row.recorded_at ? String(row.recorded_at) : null,

    createdBy: row.created_by,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),

    isOwner: row.created_by === userId
  };
}

export const detailRecordsServices = {
  async list(input: {
    sb: SupabaseClient;
    userId: string;
    q: DetailRecordsListRequest;
  }) {
    const { sb, userId, q } = input;
    const res = await detailRecordsRepo.list({ sb, userId, q });

    return {
      rows: res.rows.map((r) => toDto(r, userId)),
      total: res.total
    };
  },

  async getById(input: {
    sb: SupabaseClient;
    userId: string;
    recordId: string;
  }) {
    const { sb, userId, recordId } = input;
    const row = await detailRecordsRepo.getById({ sb, recordId });
    return row ? toDto(row, userId) : null;
  },

  async create(input: {
    sb: SupabaseClient;
    userId: string;
    values: DetailRecordCreateInput;
  }) {
    const { sb, userId, values } = input;
    const row = await detailRecordsRepo.create({ sb, userId, values });
    return toDto(row, userId);
  },

  async update(input: {
    sb: SupabaseClient;
    userId: string;
    recordId: string;
    values: DetailRecordPatchInput;
  }) {
    const { sb, userId, recordId, values } = input;

    // enforce ownership
    const existing = await detailRecordsRepo.getById({ sb, recordId });
    if (!existing) throw new Error('Detail record not found');
    if (existing.created_by !== userId) {
      throw new Error('Read-only: only the creator can update this record.');
    }

    const row = await detailRecordsRepo.update({ sb, recordId, values });
    return toDto(row, userId);
  },

  async remove(input: {
    sb: SupabaseClient;
    userId: string;
    recordId: string;
  }) {
    const { sb, userId, recordId } = input;

    // enforce ownership
    const existing = await detailRecordsRepo.getById({ sb, recordId });
    if (!existing) throw new Error('Detail record not found');
    if (existing.created_by !== userId) {
      throw new Error('Read-only: only the creator can delete this record.');
    }

    await detailRecordsRepo.remove({ sb, recordId });
    return true;
  }
};
