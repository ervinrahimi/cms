import sdb from '@/db/surrealdb';
import buildQuery from '@/utils/api/shop/queryBuilder';
import { shopTables } from '@/utils/api/tableNames';
import { NextResponse } from 'next/server';

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
    const query = buildQuery(searchParams, shopTables.payment, ['created_at']);
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
