// src/features/detail-records/types.ts

import type {
  DetailRecordsListRequest,
  DetailRecordCreateInput,
  DetailRecordPatchInput
} from './schemas/detail-record.schema';

/**
 * Row shape exposed to the UI
 * (DB fields mapped to camelCase)
 */
export type DetailRecordRow = {
  id: string;

  siteId: string;
  digLocationId: string | null;

  title: string;
  notes: string | null;

  latitude: number | null;
  longitude: number | null;

  recordedAt: string | null;

  createdBy: string;
  createdAt: string;
  updatedAt: string;

  /** UI-only */
  isOwner: boolean;
};

/**
 * List response returned from API
 */
export type DetailRecordsListResponse = {
  rows: DetailRecordRow[];
  total: number;
};

/**
 * Re-export request / input types
 * (keeps imports clean elsewhere)
 */
export type {
  DetailRecordsListRequest,
  DetailRecordCreateInput,
  DetailRecordPatchInput
};
