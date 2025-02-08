import sdb from '@/db/surrealdb';
import { ProductSchemaCreate } from '@/schemas/zod/shop';
import { checkExists } from '@/utils/api/checkExists';
import prepareUpdates from '@/utils/api/generateUpdates';
import { shopTables } from '@/utils/api/tableNames';
import { handleZodError } from '@/utils/api/zod/errorHandler.ts';
import { NextResponse } from 'next/server';
import { Patch, RecordId } from 'surrealdb';
import { ZodError } from 'zod';

/*

  Route: "api/shop/product/[id]" [ PUT - GET - DELETE ]
 
  GET: API handler for fetching a specific product from the "ShopProduct" table in SurrealDB.
  PUT: API handler for updating a specific product in the "ShopProduct" table in SurrealDB.
  DELETE: API handler for deleting a specific product from the "ShopProduct" table in SurrealDB.

*/

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await sdb();
    const { id } = await params;

    const productCheck = await checkExists(
      shopTables.product,
      id,
      `Product with ID ${id} not found.`
    );
    if (productCheck !== true) {
      return productCheck;
    }

    const product = await db.select(new RecordId(shopTables.product, id));

    return NextResponse.json(product, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: 'Failed to fetch product', details: (error as Error).message },
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

    const productCheck = await checkExists(
      shopTables.product,
      id,
      `Product with ID ${id} not found.`
    );
    if (productCheck !== true) {
      return productCheck;
    }

    const validatedBody = ProductSchemaCreate.parse(body);
    const { category_id, product_type, is_active, slug, name, description, price, stock, coverImage, files, metadata } = validatedBody;

    const updates: Patch[] = [];
    const fields = [
      { path: '/category_id', value: category_id.map(id => new RecordId(shopTables.category, id)) },
      { path: '/product_type', value: product_type },
      { path: '/is_active', value: is_active },
      { path: '/slug', value: slug },
      { path: '/name', value: name },
      { path: '/description', value: description },
      { path: '/price', value: price },
      { path: '/stock', value: stock },
      { path: '/coverImage', value: coverImage },
      { path: '/files', value: files },
      { path: '/metadata', value: metadata },
    ];

    prepareUpdates(fields, updates);

    const recordId = new RecordId(shopTables.product, id);

    // Apply the patch
    const updatedProduct = await db.patch(recordId, updates);

    return NextResponse.json(updatedProduct, {
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return handleZodError(error);
    }
    const err = error as Error;
    return NextResponse.json(
      { error: 'Failed to update product', details: err.message },
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

    const productCheck = await checkExists(
      shopTables.product,
      id,
      `Product with ID ${id} not found.`
    );
    if (productCheck !== true) {
      return productCheck;
    }

    // Delete the product
    await db.delete(new RecordId(shopTables.product, id));

    return NextResponse.json({ message: 'Product deleted successfully.' }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: {
          code: 'internal_server_error',
          message: 'Failed to delete product.',
          details: (error as Error).message,
        },
      },
      { status: 500 }
    );
  }
}
