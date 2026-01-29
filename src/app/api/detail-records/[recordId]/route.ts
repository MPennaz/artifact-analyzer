// src/app/api/detail-records/[recordId]/route.ts

import {
  DetailRecordIdParamSchema,
  DetailRecordPatchSchema
} from '@/features/detail-records/schemas/detail-record.schema';
import { detailRecordsServices } from '@/features/detail-records/services';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

type Ctx = { params: Promise<{ recordId: string }> | { recordId: string } };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { recordId } = DetailRecordIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async ({ sb, userId }) => {
      const record = await detailRecordsServices.getById({
        sb,
        userId,
        recordId
      });
      return jsonOk({ record });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const { recordId } = DetailRecordIdParamSchema.parse(await ctx.params);
    const body = await req.json();
    const values = DetailRecordPatchSchema.parse(body);

    return await withAuthApi(async ({ sb, userId }) => {
      const record = await detailRecordsServices.update({
        sb,
        userId,
        recordId,
        values
      });
      return jsonOk({ record });
    });
  } catch (err) {
    return jsonError(err);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const { recordId } = DetailRecordIdParamSchema.parse(await ctx.params);

    return await withAuthApi(async ({ sb, userId }) => {
      await detailRecordsServices.remove({ sb, userId, recordId });
      return jsonOk({ ok: true });
    });
  } catch (err) {
    return jsonError(err);
  }
}
