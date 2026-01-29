// src/app/api/dig-locations/[locationId]/route.ts

import { z } from 'zod';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

// TEMP: until your dig-locations feature is wired
const DigLocationIdParamSchema = z.object({
  locationId: z.string().uuid()
});

type Ctx = { params: Promise<{ locationId: string }> | { locationId: string } };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { locationId } = DigLocationIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async () => {
      // TODO: hook up digLocationsServices.getById(...)
      return jsonOk({ location: { id: locationId } });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(_req: Request, ctx: Ctx) {
  try {
    const { locationId } = DigLocationIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async () => {
      // TODO: hook up digLocationsServices.update(...)
      return jsonOk({ location: { id: locationId } });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { locationId } = DigLocationIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async () => {
      // TODO: hook up digLocationsServices.remove(...)
      return jsonOk({ ok: true, locationId });
    });
  } catch (err) {
    return jsonError(err);
  }
}
