// src/app/api/investigation-sites/list/route.ts

import { SitesListRequestSchema } from '@/features/investigation-sites/schemas/site.schema';
import { investigationSitesServices } from '@/features/investigation-sites/services';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const q = SitesListRequestSchema.parse(body);

    return await withAuthApi(async ({ sb, userId }) => {
      const data = await investigationSitesServices.list({ sb, userId, q });
      return jsonOk(data);
    });
  } catch (err) {
    return jsonError(err);
  }
}
