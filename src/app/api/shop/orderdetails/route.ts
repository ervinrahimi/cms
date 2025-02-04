import sdb from '@/db/surrealdb';
import { ShopOrderDetailsSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import buildQuery from '@/utils/api/shop/queryBuilder';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/orderdetails" [ POST - GET ]
 
  GET: API handler for fetching all order details from the "ShopOrderDetails" table in SurrealDB.
  POST: API handler for creating a new order detail in the "ShopOrderDetails" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, shopTables.orderDetails, ['created_at']);
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

export async function POST(request: Request) {
  try {
    const db = await sdb();
    const body = await request.json();
    const validatedBody = ShopOrderDetailsSchemaCreate.parse(body);
    const { order_id, product_id, quantity, pricePerUnit, totalPrice, appliedDiscount } =
      validatedBody;

    const orderCheck = await checkExists(
      shopTables.order,
      order_id,
      `Order with ID ${order_id} not found.`
    );
    if (orderCheck !== true) {
      return orderCheck;
    }
    const productCheck = await checkExists(
      shopTables.product,
      product_id,
      `Product with ID ${product_id} not found.`
    );
    if (productCheck !== true) {
      return productCheck;
    }

    const orderId = new RecordId(shopTables.order, order_id);
    const productId = new RecordId(shopTables.product, product_id);

    const orderDetailsData = {
      order_id: orderId,
      product_id: productId,
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      totalPrice: totalPrice,
      appliedDiscount: appliedDiscount,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdShopOrderDetails = await db.create(shopTables.orderDetails, orderDetailsData);

    return NextResponse.json(createdShopOrderDetails, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create order details', details: err.message },
      { status: 500 }
    );
  }
}
