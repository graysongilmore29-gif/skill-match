import { NextRequest } from "next/server";
import { z } from "zod";
import { jsonError, jsonOk, errorResponse, requireUser } from "@/lib/http";
import {
  confirmStake,
  declareWinner,
  fillRandoms,
  forfeitMatch,
  markReady,
  recordScore,
  rematch,
  setStakeAmount,
  startMatch,
} from "@/lib/match-service";

export const runtime = "nodejs";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("fill_randoms") }),
  z.object({ action: z.literal("ready") }),
  z.object({ action: z.literal("set_stake"), stakeCents: z.number().int() }),
  z.object({ action: z.literal("confirm_stake") }),
  z.object({ action: z.literal("start") }),
  z.object({
    action: z.literal("score"),
    teamAScore: z.number().int(),
    teamBScore: z.number().int(),
  }),
  z.object({ action: z.literal("declare"), team: z.enum(["A", "B"]) }),
  z.object({ action: z.literal("forfeit") }),
  z.object({ action: z.literal("rematch") }),
]);

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/matches/[id]/action">,
) {
  try {
    const auth = await requireUser();
    if (auth.response) return auth.response;
    const { id } = await ctx.params;
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return jsonError("Unknown match action.");
    const userId = auth.user.id;
    const body = parsed.data;
    let match;
    switch (body.action) {
      case "fill_randoms":
        match = await fillRandoms(id, userId);
        break;
      case "ready":
        match = await markReady(id, userId);
        break;
      case "set_stake":
        match = await setStakeAmount(id, userId, body.stakeCents);
        break;
      case "confirm_stake":
        match = await confirmStake(id, userId);
        break;
      case "start":
        match = await startMatch(id, userId);
        break;
      case "score":
        match = await recordScore(id, userId, body.teamAScore, body.teamBScore);
        break;
      case "declare":
        match = await declareWinner(id, userId, body.team);
        break;
      case "forfeit":
        match = await forfeitMatch(id, userId);
        break;
      case "rematch":
        match = await rematch(id, userId);
        break;
    }
    return jsonOk({ match });
  } catch (error) {
    return errorResponse(error);
  }
}
