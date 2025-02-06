import sdb from "@/db/surrealdb";
import { PaymentSchemaCreate } from "@/schemas/zod/shop";
import { checkExists } from "@/utils/api/checkExists";
import buildQuery from "@/utils/api/shop/queryBuilder";
import { shopTables } from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextRequest, NextResponse } from "next/server";
import { RecordId } from "surrealdb";
import { ZodError } from "zod";

/*

  Route: "api/shop/payment" [ POST - GET ]
 
  GET: API handler for fetching all payments from the "ShopPayment" table in SurrealDB.
  POST: API handler for creating a new payment in the "ShopPayment" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, shopTables.payment, ["created_at"]);
    const result = await db.query(query);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "An error occurred", error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const db = await sdb();
    const body = await req.json();
    body.paymentDate = new Date(body.paymentDate); // Convert paymentDate to Date object before validation
    const validatedBody = PaymentSchemaCreate.parse(body);
    const {
      order_id,
      product_id,
      paymentDate,
      paymentMethod,
      amount,
      transaction_id,
      metadata,
    } = validatedBody;

    // Convert paymentDate to Date object
  
   / for (const productId of product_id) {
      const productCheck = await checkExists(
        shopTables.product,
        productId,
        `Product with ID ${productId} not found.`
      );
      if (productCheck !== true) {
        return productCheck;
      }
    }

    const orderCheck = await checkExists(
      shopTables.order,
      order_id,
      `Order with ID ${order_id} not found.`
    );
    if (orderCheck !== true) {
      return orderCheck;
    }  
      console.log("Metadata after validation:", metadata);
    const orderId = new RecordId(shopTables.order, order_id);

    const productIds = product_id.map(
      (prod: string) => new RecordId(shopTables.product, prod)
    );

    const paymentData = {
      order_id: orderId,
      product_id: productIds,
      paymentDate,
      paymentMethod,
      amount,
      transaction_id,
      metadata,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdProduct = await db.create(shopTables.payment, paymentData);

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to create product", details: err.message },
      {
        status: 500,
      }
    );
  }
}
