import { NextResponse } from "next/server";
import { sdb } from "@/db/surrealdb";
import { RecordId } from "surrealdb";

export async function checkExists(
  tableName: string,
  id: string,
  errorMessage?: string
) {
  const db = await sdb();
  const recordExists = await db.select(new RecordId(tableName, id));
  if (!recordExists || recordExists.length === 0) {
    return NextResponse.json(
      {
        error: {
          code: "not_found",
          message: errorMessage || `${tableName} with ID ${id} does not exist.`,
        },
      },
      { status: 404 }
    );
  }
  return true;
}
