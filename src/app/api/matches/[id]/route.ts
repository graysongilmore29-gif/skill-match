import { NextRequest } from "next/server";
import { jsonOk, errorResponse, requireUser } from "@/lib/http";
import { getMatchDTO } from "@/lib/match-service";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/matches/[id]">,
) {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    const { id } = await ctx.params;
    const match = await getMatchDTO(id, auth.user.id);
    return jsonOk({ match });
  } catch (error) {
    return errorResponse(error);
  }
}
