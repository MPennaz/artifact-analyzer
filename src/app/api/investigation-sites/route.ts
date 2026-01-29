// src/app/api/investigation-sites/route.ts

import { SiteCreateSchema } from '@/features/investigation-sites/schemas/site.schema';
import { investigationSitesServices } from '@/features/investigation-sites/services';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const values = SiteCreateSchema.parse(body);

    return await withAuthApi(async ({ sb, userId }) => {
      const site = await investigationSitesServices.create({ sb, userId, values });
      return jsonOk({ site });
    });
  } catch (err) {
    return jsonError(err);
  }
}
