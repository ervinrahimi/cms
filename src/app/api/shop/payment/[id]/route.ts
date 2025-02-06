import sdb from "@/db/surrealdb";
import { PaymentSchemaUpdate } from "@/schemas/zod/shop";
import { checkExists } from "@/utils/api/checkExists";
import prepareUpdates from "@/utils/api/generateUpdates";
import { shopTables } from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextResponse } from "next/server";
import { Patch, RecordId } from "surrealdb";
import { ZodError } from "zod";

/*

    Route: "api/shop/payment/[id]" [ PUT - GET - DELETE ]
 
    GET: API handler for fetching a specific payment from the "ShopPayment" table in SurrealDB.
    PUT: API handler for updating a specific payment in the "ShopPayment" table in SurrealDB.
    DELETE: API handler for deleting a specific payment from the "ShopPayment" table in SurrealDB.

*/

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const paymentCheck = await checkExists(
      shopTables.payment,
      id,
      `Payment with ID ${id} not found.`
    );
    if (paymentCheck !== true) {
      return paymentCheck;
    }

    const payment = await db.select(new RecordId(shopTables.payment, id));

    return NextResponse.json(payment, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch payment", details: (error as Error).message },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const body = await req.json();
    const { id } = await params;

    const paymentCheck = await checkExists(
      shopTables.payment,
      id,
      `Payment with ID ${id} not found.`
    );
    if (paymentCheck !== true) {
      return paymentCheck;
    }

    const validatedBody = PaymentSchemaUpdate.parse(body);
    const {
      order_id,
      product_id,
      paymentMethod,
      paymentDate,
      amount,
      transaction_id,
      metadata,
    } = validatedBody;

    if (order_id) {
            const orderCheck = await checkExists(
                shopTables.order,
                order_id,
                `Order with ID ${order_id} not found.`
            );
            if (orderCheck !== true) {
                return orderCheck;
            }
        }

        if (product_id) {
            for (const productId of product_id) {
                const productCheck = await checkExists(
                    shopTables.product,
                    productId,
                    `Product with ID ${productId} not found.`
                );
                if (productCheck !== true) {
                    return productCheck;
                }
            }
        } 
    const updates: Patch[] = [];
    const fields = [
      {
        path: "/order_id",
        value: order_id ? new RecordId(shopTables.order, order_id) : undefined,
      },
      {
        path: "/product_id",
        value: product_id
          ? product_id.map(
              (prod: string) => new RecordId(shopTables.product, prod)
            )
          : undefined,
      },
      { path: "/paymentDate", value:  paymentDate  },
      { path: "/paymentMethod", value: paymentMethod },
      { path: "/amount", value: amount },
      { path: "/transaction_id", value: transaction_id },
      { path: "/metadata", value: metadata },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.payment, id);

    // Apply the patch
    const updatedPayment = await db.patch(recordId, updates);

    return NextResponse.json(updatedPayment, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to update payment", details: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const paymentCheck = await checkExists(
      shopTables.payment,
      id,
      `Payment with ID ${id} not found.`
    );
    if (paymentCheck !== true) {
      return paymentCheck;
    }

    // Delete the payment
    await db.delete(new RecordId(shopTables.payment, id));

    return NextResponse.json(
      { message: "Payment deleted successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: "internal_server_error",
          message: "Failed to delete payment.",
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}


