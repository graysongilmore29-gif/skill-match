import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk, errorResponse, requireUser } from "@/lib/http";
import { joinByCode } from "@/lib/match-service";

export const runtime = "nodejs";

const schema = z.object({
  code: z.string().min(4),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return jsonError("Enter an invite code.");
    const match = await joinByCode(auth.user.id, parsed.data.code);
    return jsonOk({ match });
  } catch (error) {
    return errorResponse(error);
  }
}
