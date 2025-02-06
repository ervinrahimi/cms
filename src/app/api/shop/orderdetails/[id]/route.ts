import sdb from '@/db/surrealdb';
import { ShopOrderDetailsSchemaUpdate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/orderdetails/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific order detail from the "ShopOrderDetails" table in SurrealDB.
  PUT: API handler for updating a specific order detail in the "ShopOrderDetails" table in SurrealDB.
  DELETE: API handler for deleting a specific order detail from the "ShopOrderDetails" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    // Check if the ID is valid
    const orderDetailCheck = await checkExists(shopTables.orderDetails, id, `Order detail with ID ${id} not found.`);
    if (orderDetailCheck !== true) {
      return orderDetailCheck;
    }

    const orderDetail = await db.select(new RecordId(shopTables.orderDetails, id));

    return NextResponse.json(orderDetail, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch order detail', details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;
    const body = await req.json();

    // Check if the ID is valid
    const orderDetailCheck = await checkExists(shopTables.orderDetails, id, `Order detail with ID ${id} not found.`);
    if (orderDetailCheck !== true) {
      return orderDetailCheck;
    }

    const validatedBody = ShopOrderDetailsSchemaUpdate.parse(body);
    const { order_id, product_id, quantity, pricePerUnit, totalPrice, appliedDiscount } = validatedBody;

    // Check if the order_id is valid
    if (order_id) {
      const orderCheck = await checkExists(shopTables.order, order_id, `Order with ID ${order_id} not found.`);
      if (orderCheck !== true) {
        return orderCheck;
      }
    }

    // Check if the product_id is valid
    if (product_id) {
      const productCheck = await checkExists(shopTables.product, product_id, `Product with ID ${product_id} not found.`);
      if (productCheck !== true) {
        return productCheck;
      }
    }

    const updates: Patch[] = [];

    const fields = [
      { path: '/order_id', value: order_id ? new RecordId(shopTables.order, order_id) : undefined },
      { path: '/product_id', value: product_id ? new RecordId(shopTables.product, product_id) : undefined },
      { path: '/quantity', value: quantity },
      { path: '/pricePerUnit', value: pricePerUnit },
      { path: '/totalPrice', value: totalPrice },
      { path: '/appliedDiscount', value: appliedDiscount },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.orderDetails, id);

    // Apply the patch
    const updatedOrderDetail = await db.patch(recordId, updates);

    return NextResponse.json(updatedOrderDetail, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update order detail', details: err.message },
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

    // Check if the ID is valid
    const orderDetailCheck = await checkExists(shopTables.orderDetails, id, `Order detail with ID ${id} not found.`);
    if (orderDetailCheck !== true) {
      return orderDetailCheck;
    }

    // Delete the order detail
    await db.delete(new RecordId(shopTables.orderDetails, id));

    return NextResponse.json({ message: 'Order detail deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to delete order detail', details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}
