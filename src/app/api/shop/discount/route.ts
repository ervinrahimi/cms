import sdb from '@/db/surrealdb';
import buildQuery from '@/utils/api/shop/queryBuilder';
import { shopTables } from '@/utils/api/tableNames';
import { NextRequest, NextResponse } from 'next/server';
import { DiscountSchemaCreate } from '@/schemas/zod/shop';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';

/*

  Route: "api/shop/discount" [ POST - GET ]
 
  GET: API handler for fetching all discounts from the "ShopDiscount" table in SurrealDB.
  POST: API handler for creating a new discount in the "ShopDiscount" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, shopTables.discount, ['created_at', 'slug'], 'name');
    const result = await db.query(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { message: 'An error occurred', error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body = await req.json();
    const validatedBody = DiscountSchemaCreate.parse(body);
    const { product_id, name, usageLimit, discountCode, discountPercentage, startDate, endDate } = validatedBody;

    const discountData = {
      product_id: product_id.map(id => new RecordId(shopTables.product, id)),
      name: name,
      usageLimit: usageLimit,
      discountCode: discountCode,
      discountPercentage: discountPercentage,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdDiscount = await db.create(shopTables.discount, discountData);

    return NextResponse.json(createdDiscount, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create discount', details: err.message },
      {
        status: 500,
      }
    );
  }
}