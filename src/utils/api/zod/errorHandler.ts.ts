import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function handleZodError(error: ZodError): NextResponse {
  const errors = error.errors.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  const secondError = errors[0] ? [errors[0]] : errors;

  return NextResponse.json(
    {
      error: "Validation error",
      details: secondError,
    },
    { status: 400 }
  );
}
