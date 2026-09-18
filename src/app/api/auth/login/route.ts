import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk, errorResponse } from "@/lib/http";
import { loginUser } from "@/lib/match-service";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return jsonError("Email and password are required.");
    const user = await loginUser(parsed.data.email, parsed.data.password);
    await createSession(user.id);
    return jsonOk({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
