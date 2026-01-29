// src/features/investigation-sites/types.ts

export type SiteRowDb = {
  id: string;
  name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type SiteRow = SiteRowDb & {
  isOwner: boolean;
};

export type SitesListRequest = {
  page: number;
  pageSize: number;
  search?: string;
  orderBy?: 'updated_at' | 'created_at' | 'name';
  orderDir?: 'asc' | 'desc';
  ownerOnly?: boolean;
};

export type SiteCreateInput = {
  name: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export type SitePatchInput = {
  name?: string;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};
