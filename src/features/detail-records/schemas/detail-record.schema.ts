// src/features/detail-records/schemas/detail-record.schema.ts
import { z } from 'zod';

export const DetailRecordOrderBySchema = z.enum([
  'updated_at',
  'created_at',
  'recorded_at',
  'title'
]);

export const OrderDirSchema = z.enum(['asc', 'desc']);

export const DetailRecordsListRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(25),

  // Filters
  siteId: z.string().uuid().optional(),
  digLocationId: z.string().uuid().optional(),
  search: z.string().trim().min(1).optional(),

  // If you want “my stuff only” as an option (future permissions won’t break this)
  ownerOnly: z.boolean().optional(),

  orderBy: DetailRecordOrderBySchema.default('updated_at'),
  orderDir: OrderDirSchema.default('desc')
});

export const DetailRecordCreateSchema = z.object({
  siteId: z.string().uuid(),
  digLocationId: z.string().uuid().nullable().optional(),

  title: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(10000).nullable().optional(),

  latitude: z.number().finite().nullable().optional(),
  longitude: z.number().finite().nullable().optional(),

  // accept ISO string; store as timestamptz
  recordedAt: z.string().datetime().nullable().optional()
});

export const DetailRecordPatchSchema = z.object({
  siteId: z.string().uuid().optional(),
  digLocationId: z.string().uuid().nullable().optional(),

  title: z.string().trim().min(1).max(200).optional(),
  notes: z.string().trim().max(10000).nullable().optional(),

  latitude: z.number().finite().nullable().optional(),
  longitude: z.number().finite().nullable().optional(),

  recordedAt: z.string().datetime().nullable().optional()
});

export const DetailRecordIdParamSchema = z.object({
  recordId: z.string().uuid()
});

export type DetailRecordsListRequest = z.infer<typeof DetailRecordsListRequestSchema>;
export type DetailRecordCreateInput = z.infer<typeof DetailRecordCreateSchema>;
export type DetailRecordPatchInput = z.infer<typeof DetailRecordPatchSchema>;
