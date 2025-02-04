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

    const orderDetailsCheck = await checkExists(
      shopTables.orderDetails,
      id,
      `Order detail with ID ${id} not found.`
    );
    if (orderDetailsCheck !== true) {
      return orderDetailsCheck;
    }

    const orderDetails = await db.select(new RecordId(shopTables.orderDetails, id));

    return NextResponse.json(orderDetails, { status: 200 });
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
    const body = await req.json();
    const { id } = await params;

    const orderDetailsCheck = await checkExists(
      shopTables.orderDetails,
      id,
      `Order detail with ID ${id} not found.`
    );
    if (orderDetailsCheck !== true) {
      return orderDetailsCheck;
    }

    const validatedBody = ShopOrderDetailsSchemaUpdate.parse(body);
    const { order_ref, product_ref, quantity, pricePerUnit, totalPrice, appliedDiscount } =
      validatedBody;

    if (order_ref) {
      const orderCheck = await checkExists(
        shopTables.order,
        order_ref,
        `Order with ID ${order_ref} not found.`
      );
      if (orderCheck !== true) {
        return orderCheck;
      }
    }
    if (product_ref) {
      const productCheck = await checkExists(
        shopTables.product,
        product_ref,
        `Product with ID ${product_ref} not found.`
      );
      if (productCheck !== true) {
        return productCheck;
      }
    }

    const updates: Patch[] = [];
    const fields = [
      { path: '/order_ref', value: order_ref },
      { path: '/product_ref', value: product_ref },
      { path: '/quantity', value: quantity },
      { path: '/pricePerUnit', value: pricePerUnit },
      { path: '/totalPrice', value: totalPrice },
      { path: '/appliedDiscount', value: appliedDiscount },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.orderDetails, id);

    // Apply the patch
    const updatedOrderDetails = await db.patch(recordId, updates);

    return NextResponse.json(updatedOrderDetails, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    return NextResponse.json(
      { error: 'Failed to update order detail', details: (error as Error).message },
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

    const orderDetailsCheck = await checkExists(
      shopTables.orderDetails,
      id,
      `Order detail with ID ${id} not found.`
    );
    if (orderDetailsCheck !== true) {
      return orderDetailsCheck;
    }

    const recordId = new RecordId(shopTables.orderDetails, id);

    // Delete the order detail
    await db.delete(recordId);

    return NextResponse.json({ message: 'Order detail deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete order detail',
          details: (error as Error).message,
        },
      },
      {
        status: 500,
      }
    );
  }
}
