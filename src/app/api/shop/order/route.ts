import sdb from '@/db/surrealdb';
import { ShopOrderSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import buildQuery from '@/utils/api/shop/queryBuilder';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/order" [ POST - GET ]
 
  GET: API handler for fetching all orders from the "ShopOrder" table in SurrealDB.
  POST: API handler for creating a new order in the "ShopOrder" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, shopTables.order, ['created_at']);
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await sdb();
    const validatedBody = ShopOrderSchemaCreate.parse(body);
    const { user_id, shipping_address_id, totalAmount, status } = validatedBody;

    const userCheck = await checkExists(
      shopTables.user,
      user_id,
      `user with ID ${user_id} not found.`
    );
    if (userCheck !== true) {
      return userCheck;
    }

    const addressCheck = await checkExists(
      shopTables.address,
      shipping_address_id,
      `Address with ID ${shipping_address_id} not found.`
    );
    if (addressCheck !== true) {
      return addressCheck;
    }

    const userId = new RecordId(shopTables.user, user_id);
    const shippingAddressId = new RecordId(shopTables.address, shipping_address_id);

    const orderData = {
      user_id: userId,
      shipping_address_id: shippingAddressId,
      orderDate: new Date(),
      totalAmount: totalAmount,
      status: status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdShopOrder = await db.create(shopTables.order, orderData);

    return NextResponse.json(createdShopOrder, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create order', details: err.message },
      { status: 500 }
    );
  }
}
