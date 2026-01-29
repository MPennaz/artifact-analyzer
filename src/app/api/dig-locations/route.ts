// src/app/api/dig-locations/route.ts
import { jsonOk, jsonError, withAuthApi } from '@/lib/api/with-auth';

export async function GET(_req: Request) {
  try {
    return await withAuthApi(async () => jsonOk({ ok: true }));
  } catch (err) {
    return jsonError(err);
  }
}
