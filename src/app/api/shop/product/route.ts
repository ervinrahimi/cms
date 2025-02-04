import sdb from '@/db/surrealdb';
import { ProductSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextRequest, NextResponse } from 'next/server';
import { RecordId } from 'surrealdb';
import { ZodError } from 'zod';
import buildQuery from '@/utils/api/shop/queryBuilder';


/*

  Route: "api/shop/product" [ POST - GET ]
 
  GET: API handler for fetching all products from the "ShopProduct" table in SurrealDB.
  POST: API handler for creating a new product in the "ShopProduct" table in SurrealDB.

*/

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const db = await sdb();
    const query = buildQuery(searchParams, shopTables.product, ['created_at', 'price'], 'name');
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
    const validatedBody = ProductSchemaCreate.parse(body);
    const { category_id, product_type, is_active, slug, name, description, price, stock, coverImage, files, metadata } = validatedBody;

    // Validate category IDs
    for (const catId of category_id) {
      const categoryCheck = await checkExists(
        shopTables.category,
        catId,
        `Category with ID ${catId} not found.`
      );
      if (categoryCheck !== true) {
        return categoryCheck;
      }
    }

    const categoryIds = category_id.map((cat: string) => new RecordId(shopTables.category, cat));

    const productData = {
      category_id: categoryIds,
      product_type,
      is_active,
      slug,
      name,
      description,
      price,
      stock,
      coverImage,
      files,
      metadata,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdProduct = await db.create(shopTables.product, productData);

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }

    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to create product', details: err.message },
      {
        status: 500,
      }
    );
  }
}