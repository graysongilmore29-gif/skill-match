import { jsonOk, errorResponse } from "@/lib/http";
import { clearSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    await clearSession();
    return jsonOk({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
