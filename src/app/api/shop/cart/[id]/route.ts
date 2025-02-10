import sdb from "@/db/surrealdb";
import { ShopCartSchemaUpdate } from "@/schemas/zod/shop";
import { checkExists } from "@/utils/api/checkExists";
import prepareUpdates from "@/utils/api/generateUpdates";
import { shopTables } from "@/utils/api/tableNames";
import { handleZodError } from "@/utils/api/zod/errorHandler.ts";
import { NextResponse } from "next/server";
import { Patch, RecordId } from "surrealdb";
import { ZodError } from "zod";

/*

    Route: "api/shop/cart/[id]" [ PUT - GET - DELETE ]
 
    GET: API handler for fetching a specific cart from the "ShopCart" table in SurrealDB.
    PUT: API handler for updating a specific cart in the "ShopCart" table in SurrealDB.
    DELETE: API handler for deleting a specific cart from the "ShopCart" table in SurrealDB.

*/

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await sdb();
    const { id } = await params;

    const cartCheck = await checkExists(
      shopTables.cart,
      id,
      `Cart with ID ${id} not found.`
    );
    if (cartCheck !== true) {
      return cartCheck;
    }

    const cart = await db.select(new RecordId(shopTables.cart, id));

    return NextResponse.json(cart, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch cart", details: (error as Error).message },
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

    const cartCheck = await checkExists(
      shopTables.cart,
      id,
      `Cart with ID ${id} not found.`
    );
    if (cartCheck !== true) {
      return cartCheck;
    }
    const validatedBody = ShopCartSchemaUpdate.parse(body);
    const { user_id, items } = validatedBody;

    if (user_id) {
      const userCheck = await checkExists(
        shopTables.user,
        user_id,
        `user with ID ${id} not found.`
      );
      if (userCheck !== true) {
        return userCheck;
      }
    }

    if (items) {
      for (const item of items) {
        const itemCheck = await checkExists(
          shopTables.product,
          item.product_id,
          `Product with ID ${item.product_id} not found.`
        );
        if (itemCheck !== true) {
          return itemCheck;
        }
      }
    }

    const updates: Patch[] = [];
    const fields = [
      {
        path: "/user_id",
        value: user_id ? new RecordId(shopTables.user, user_id) : undefined,
      },
      {
        path: "/items",
        value: items ? items : undefined
      },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.cart, id);

    // Apply the patch
    const updatedCart = await db.patch(recordId, updates);

    return NextResponse.json(updatedCart, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: "Failed to update cart", details: err.message },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string; item_id?: string } }) {
  const { id, item_id } = await params;
  try {
      const db = await sdb();

      const cartCheck = await checkExists(shopTables.cart, id, `Cart with ID ${id} not found.`);
      if (cartCheck !== true) {
          return cartCheck;
      }

      if (item_id) {
          const itemCheck = await checkExists(shopTables.product, item_id, `Product with ID ${item_id} not found.`);
          if (itemCheck !== true) {
              return itemCheck;
          }

          // Remove the item from the cart
          await db.query(`UPDATE ${shopTables.cart} SET items = array::remove(items, $item_id) WHERE id = $cart_id`, {
              item_id: new RecordId(shopTables.product, item_id),
              cart_id: id,
          });

          return NextResponse.json(
              { message: "Item removed from cart successfully." },
              { status: 200 }
          );
      } else {
          // Delete the cart
          await db.delete(new RecordId(shopTables.cart, id));
          return NextResponse.json(
              { message: "Cart deleted successfully." },
              { status: 200 }
          );
      }
  } catch (error: unknown) {
      return NextResponse.json(
          {
              error: {
                  code: "internal_server_error",
                  message: item_id ? "Failed to remove item from cart." : "Failed to delete cart.",
                  details: (error as Error).message,
              },
          },
          { status: 500 }
      );
  }
}
