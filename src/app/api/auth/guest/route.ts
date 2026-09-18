import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonOk, errorResponse } from "@/lib/http";
import { createGuest } from "@/lib/match-service";
import { createSession } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  displayName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    const user = await createGuest(parsed.success ? parsed.data.displayName : undefined);
    await createSession(user.id);
    return jsonOk({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
