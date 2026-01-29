// src/app/api/investigation-sites/[siteId]/route.ts

import {
  SiteIdParamSchema,
  SitePatchSchema
} from '@/features/investigation-sites/schemas/site.schema';
import { investigationSitesServices } from '@/features/investigation-sites/services';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

type Ctx = { params: Promise<{ siteId: string }> | { siteId: string } };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { siteId } = SiteIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async ({ sb, userId }) => {
      const site = await investigationSitesServices.getById({
        sb,
        userId,
        siteId
      });
      return jsonOk({ site });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { siteId } = SiteIdParamSchema.parse(await ctx.params);
    const body = await req.json();
    const values = SitePatchSchema.parse(body);

    return await withAuthApi(async ({ sb, userId }) => {
      const site = await investigationSitesServices.update({
        sb,
        userId,
        siteId,
        values
      });
      return jsonOk({ site });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { siteId } = SiteIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async ({ sb, userId }) => {
      await investigationSitesServices.remove({ sb, userId, siteId });
      return jsonOk({ ok: true });
    });
  } catch (err) {
    return jsonError(err);
  }
}
