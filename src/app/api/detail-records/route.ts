// src/app/api/detail-records/route.ts

import { DetailRecordCreateSchema } from '@/features/detail-records/schemas/detail-record.schema';
import { detailRecordsServices } from '@/features/detail-records/services';
import { withAuthApi, jsonOk, jsonError } from '@/lib/api/with-auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const values = DetailRecordCreateSchema.parse(body);

    return await withAuthApi(async ({ sb, userId }) => {
      const record = await detailRecordsServices.create({ sb, userId, values });
      return jsonOk({ record });
    });
  } catch (err) {
    return jsonError(err);
  }
}
