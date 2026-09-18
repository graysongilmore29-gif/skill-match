import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";

export function jsonOk<T>(body: T, status = 200) {
  return NextResponse.json(body, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user || !user.wallet) {
    return {
      user: null,
      response: jsonError("Sign in required", 401),
    } as const;
  }
  return { user, response: null } as const;
}

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return jsonError(error.message, error.status);
  }
  console.error(error);
  return jsonError("Something went wrong", 500);
}
