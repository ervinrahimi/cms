import sdb from '@/db/surrealdb';
import { ShopCartSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import buildQuery from '@/utils/api/shop/queryBuilder';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/cart" [ POST - GET ]
 
 GET: API handler for fetching all carts from the "ShopCart" table in SurrealDB.
 POST: API handler for creating a new cart in the "ShopCart" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();

    const query = buildQuery(searchParams, shopTables.cart, ['created_at']);
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
    const validatedBody = ShopCartSchemaCreate.parse(body);
    const { user_id, items } = validatedBody;

    const userCheck = await checkExists(
      shopTables.user,
      user_id,
      `User with ID ${user_id} not found.`
    );
    if (userCheck !== true) {
      return userCheck;
    }

    console.log('Creating cart with items:', items);
    // Convert user_id to RecordId object
    const userId = new RecordId(shopTables.user, user_id);
    const cartData = {
      user_id: userId,
      items: items,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCart = await db.create(shopTables.cart, cartData);

    return NextResponse.json(createdCart, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create cart', details: err.message },
      {
        status: 500,
      }
    );
  }
}
