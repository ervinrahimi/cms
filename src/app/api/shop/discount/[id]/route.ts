import sdb from '@/db/surrealdb';
import { DiscountSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/discount/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific discount from the "ShopDiscount" table in SurrealDB.
  PUT: API handler for updating a specific discount in the "ShopDiscount" table in SurrealDB.
  DELETE: API handler for deleting a specific discount from the "ShopDiscount" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    const discountCheck = await checkExists(
      shopTables.discount,
      id,
      `Discount with ID ${id} not found.`
    );
    if (discountCheck !== true) {
      return discountCheck;
    }

    const discount = await db.select(new RecordId(shopTables.discount, id));

    return NextResponse.json(discount, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch discount', details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const body = await req.json();
    const { id } = await params;

    const discountCheck = await checkExists(
      shopTables.discount,
      id,
      `Discount with ID ${id} not found.`
    );
    if (discountCheck !== true) {
      return discountCheck;
    }

    const validatedBody = DiscountSchemaCreate.parse(body);
    const { product_id, name, usageLimit, discountCode, discountPercentage, startDate, endDate } = validatedBody;

    const updates: Patch[] = [];
    const fields = [
      { path: '/product_id', value: product_id.map(id => new RecordId(shopTables.product, id)) },
      { path: '/name', value: name },
      { path: '/usageLimit', value: usageLimit },
      { path: '/discountCode', value: discountCode },
      { path: '/discountPercentage', value: discountPercentage },
      { path: '/startDate', value: new Date(startDate) },
      { path: '/endDate', value: new Date(endDate) },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.discount, id);

    // Apply the patch
    const updatedDiscount = await db.patch(recordId, updates);

    return NextResponse.json(updatedDiscount, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update discount', details: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    const discountCheck = await checkExists(
      shopTables.discount,
      id,
      `Discount with ID ${id} not found.`
    );
    if (discountCheck !== true) {
      return discountCheck;
    }

    // Delete the discount
    await db.delete(new RecordId(shopTables.discount, id));

    return NextResponse.json({ message: 'Discount deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete discount.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
