import { jsonOk, errorResponse } from "@/lib/http";
import { getMe } from "@/lib/match-service";
import { getSessionUserId } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    return jsonOk(await getMe(userId));
  } catch (error) {
    return errorResponse(error);
  }
}
