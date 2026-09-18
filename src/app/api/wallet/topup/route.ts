import { jsonOk, errorResponse, requireUser } from "@/lib/http";
import { topUpWallet, getMe } from "@/lib/match-service";

export const runtime = "nodejs";

export async function POST() {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    await topUpWallet(auth.user.id);
    return jsonOk(await getMe(auth.user.id));
  } catch (error) {
    return errorResponse(error);
  }
}
