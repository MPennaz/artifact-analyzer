// src/features/investigation-sites/schemas/site.schema.ts

import { z } from 'zod';

export const SiteOrderBySchema = z.enum(['updated_at', 'created_at', 'name']);
export const OrderDirSchema = z.enum(['asc', 'desc']);

export const SitesListRequestSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(200).default(25),
  search: z.string().trim().min(1).optional(),
  orderBy: SiteOrderBySchema.default('updated_at'),
  orderDir: OrderDirSchema.default('desc'),
  ownerOnly: z.boolean().optional()
});

export const SiteCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).nullable().optional(),
  latitude: z.number().finite().nullable().optional(),
  longitude: z.number().finite().nullable().optional()
});

export const SitePatchSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(2000).nullable().optional(),
  latitude: z.number().finite().nullable().optional(),
  longitude: z.number().finite().nullable().optional()
});

export const SiteIdParamSchema = z.object({
  siteId: z.string().uuid()
});
