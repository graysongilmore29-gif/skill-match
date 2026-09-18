import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk, errorResponse, requireUser } from "@/lib/http";
import { createMatch } from "@/lib/match-service";

export const runtime = "nodejs";

const schema = z.object({
  mode: z.enum(["1v1", "2v2", "3v3"]),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return jsonError("Choose 1v1, 2v2, or 3v3.");
    const match = await createMatch(auth.user.id, parsed.data.mode);
    return jsonOk({ match });
  } catch (error) {
    return errorResponse(error);
  }
}
