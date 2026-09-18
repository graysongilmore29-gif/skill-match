import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { AppError } from "./http";
import {
  DEFAULT_STAKE_CENTS,
  STARTING_BALANCE_CENTS,
  TOP_UP_CENTS,
  formatPlayMoney,
} from "./money";
import {
  FILL_NAMES,
  clampStakeCents,
  isMode,
  makeInviteCode,
  nextOpenSlot,
  oppositeTeam,
  potCents,
  rosterSize,
  splitPot,
  teamSize,
  winnerFromScores,
  type Mode,
  type MatchStatus,
  type TeamId,
} from "./match-rules";
import type { MatchDTO, MeDTO, PlayerDTO, SlotDTO } from "./types";

const OPEN_STATUSES: MatchStatus[] = ["waiting", "ready", "in_match"];

function isUniqueError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function registerUser(input: {
  email: string;
  password: string;
  displayName: string;
}) {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();
  if (!email || !email.includes("@")) {
    throw new AppError("Enter a valid email.");
  }
  if (input.password.length < 6) {
    throw new AppError("Password must be at least 6 characters.");
  }
  if (displayName.length < 2) {
    throw new AppError("Display name must be at least 2 characters.");
  }
  const passwordHash = await bcrypt.hash(input.password, 10);
  try {
    return await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        wallet: { create: { balanceCents: STARTING_BALANCE_CENTS } },
      },
      include: { wallet: true },
    });
  } catch (error) {
    if (isUniqueError(error)) {
      throw new AppError("That email is already in use.");
    }
    throw error;
  }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    include: { wallet: true },
  });
  if (!user || !user.passwordHash || user.isBot) {
    throw new AppError("Email or password is incorrect.", 401);
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Email or password is incorrect.", 401);
  return user;
}

export async function createGuest(displayName?: string) {
  const suffix = crypto.randomUUID().slice(0, 8);
  return prisma.user.create({
    data: {
      email: `guest-${suffix}@play.local`,
      displayName: (displayName?.trim() || `Guest ${suffix.slice(0, 4)}`).slice(
        0,
        24,
      ),
      wallet: { create: { balanceCents: STARTING_BALANCE_CENTS } },
    },
    include: { wallet: true },
  });
}

export async function getMe(userId: string | null): Promise<MeDTO> {
  if (!userId) {
    return { user: null, wallet: null, activeMatch: null };
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { wallet: true },
  });
  if (!user || !user.wallet) {
    return { user: null, wallet: null, activeMatch: null };
  }
  const active = await prisma.matchPlayer.findFirst({
    where: {
      userId,
      match: { status: { in: OPEN_STATUSES } },
    },
    include: { match: true },
    orderBy: { createdAt: "desc" },
  });
  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      isBot: user.isBot,
    },
    wallet: { balanceCents: user.wallet.balanceCents },
    activeMatch: active
      ? {
          id: active.match.id,
          status: active.match.status as MatchStatus,
          mode: active.match.mode as Mode,
        }
      : null,
  };
}

export async function topUpWallet(userId: string) {
  const wallet = await prisma.wallet.update({
    where: { userId },
    data: { balanceCents: { increment: TOP_UP_CENTS } },
  });
  await prisma.ledgerEntry.create({
    data: {
      userId,
      type: "topup_stub",
      amountCents: TOP_UP_CENTS,
      note: "Simulated play-money top-up",
    },
  });
  return wallet;
}

async function findOpenMatchForUser(userId: string) {
  return prisma.matchPlayer.findFirst({
    where: {
      userId,
      match: { status: { in: OPEN_STATUSES } },
    },
    include: { match: true },
  });
}

export async function createMatch(userId: string, modeValue: string) {
  if (!isMode(modeValue)) {
    throw new AppError("Choose 1v1, 2v2, or 3v3.");
  }
  const existing = await findOpenMatchForUser(userId);
  if (existing) {
    throw new AppError("You already have an open match. Finish or settle it first.");
  }
  for (let attempt = 0; attempt < 6; attempt++) {
    const code = makeInviteCode();
    try {
      const match = await prisma.match.create({
        data: {
          code,
          mode: modeValue,
          status: "waiting",
          stakeCents: DEFAULT_STAKE_CENTS,
          createdById: userId,
          players: {
            create: {
              userId,
              team: "A",
              slot: 1,
              isReady: false,
            },
          },
        },
      });
      return toMatchDTO(match.id, userId);
    } catch (error) {
      if (isUniqueError(error)) continue;
      throw error;
    }
  }
  throw new AppError("Could not create a match code. Try again.");
}

export async function joinByCode(userId: string, rawCode: string) {
  const code = rawCode.trim().toUpperCase();
  if (code.length < 4) throw new AppError("Enter a valid invite code.");
  const match = await prisma.match.findUnique({
    where: { code },
    include: { players: true },
  });
  if (!match) throw new AppError("No match found for that code.", 404);
  if (match.status !== "waiting") {
    throw new AppError("That match is no longer open to join.");
  }
  const already = match.players.find((player) => player.userId === userId);
  if (already) return toMatchDTO(match.id, userId);
  const existing = await findOpenMatchForUser(userId);
  if (existing && existing.matchId !== match.id) {
    throw new AppError("You already have an open match.");
  }
  await addPlayer(match.id, userId, { isRandomFill: false, isReady: false });
  return toMatchDTO(match.id, userId);
}

async function addPlayer(
  matchId: string,
  userId: string,
  options: { isRandomFill: boolean; isReady: boolean },
) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { players: true },
    });
    if (!match) throw new AppError("Match not found.", 404);
    if (match.status !== "waiting") {
      throw new AppError("This roster is locked.");
    }
    if (match.players.some((player) => player.userId === userId)) return;
    if (!isMode(match.mode)) throw new AppError("Invalid match mode.");
    const seat = nextOpenSlot(match.players, match.mode);
    if (!seat) throw new AppError("Roster is full.");
    try {
      await prisma.matchPlayer.create({
        data: {
          matchId,
          userId,
          team: seat.team,
          slot: seat.slot,
          isRandomFill: options.isRandomFill,
          isReady: options.isReady,
        },
      });
      return;
    } catch (error) {
      if (isUniqueError(error)) continue;
      throw error;
    }
  }
  throw new AppError("Could not claim a roster slot. Try again.");
}

export async function fillRandoms(matchId: string, userId: string) {
  await assertPlayer(matchId, userId);
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: { include: { user: true } } },
  });
  if (!match) throw new AppError("Match not found.", 404);
  if (match.status !== "waiting") {
    throw new AppError("Random fill is only available while the roster is open.");
  }
  if (!isMode(match.mode)) throw new AppError("Invalid match mode.");
  const needed = rosterSize(match.mode) - match.players.length;
  if (needed <= 0) return toMatchDTO(matchId, userId);

  const usedNames = new Set(
    match.players.map((player) => player.user.displayName.replace(" (fill)", "")),
  );
  for (let i = 0; i < needed; i++) {
    const name =
      FILL_NAMES.find((candidate) => !usedNames.has(candidate)) ||
      `Fill ${i + 1}`;
    usedNames.add(name);
    const bot = await prisma.user.create({
      data: {
        email: `fill-${crypto.randomUUID()}@play.local`,
        displayName: `${name} (fill)`,
        isBot: true,
        wallet: { create: { balanceCents: STARTING_BALANCE_CENTS } },
      },
    });
    await addPlayer(matchId, bot.id, { isRandomFill: true, isReady: true });
  }
  await maybeAdvanceToReady(matchId);
  return toMatchDTO(matchId, userId);
}

export async function markReady(matchId: string, userId: string) {
  const player = await assertPlayer(matchId, userId);
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new AppError("Match not found.", 404);
  if (match.status !== "waiting") {
    throw new AppError("Ready up is only used before stakes are locked.");
  }
  if (!isMode(match.mode)) throw new AppError("Invalid match mode.");
  const count = await prisma.matchPlayer.count({ where: { matchId } });
  if (count < rosterSize(match.mode)) {
    throw new AppError("Roster must be full before you can ready up.");
  }
  await prisma.matchPlayer.update({
    where: { id: player.id },
    data: { isReady: true },
  });
  await maybeAdvanceToReady(matchId);
  return toMatchDTO(matchId, userId);
}

async function maybeAdvanceToReady(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: true },
  });
  if (!match || match.status !== "waiting" || !isMode(match.mode)) return;
  if (match.players.length < rosterSize(match.mode)) return;
  if (match.players.some((player) => !player.isReady)) return;
  await prisma.match.updateMany({
    where: { id: matchId, status: "waiting" },
    data: { status: "ready" },
  });
  await lockBotStakes(matchId);
}

async function lockBotStakes(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: { include: { user: true } } },
  });
  if (!match) return;
  for (const player of match.players) {
    if (player.user.isBot && !player.stakeLocked) {
      await lockStakeInternal(matchId, player.userId);
    }
  }
}

export async function setStakeAmount(
  matchId: string,
  userId: string,
  stakeCents: number,
) {
  await assertPlayer(matchId, userId);
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: true },
  });
  if (!match) throw new AppError("Match not found.", 404);
  if (match.status !== "ready") {
    throw new AppError("Stake amount can only change before the match starts.");
  }
  if (match.players.some((player) => player.stakeLocked)) {
    throw new AppError("Stake is frozen after the first lock.");
  }
  const next = clampStakeCents(stakeCents);
  await prisma.match.update({
    where: { id: matchId },
    data: { stakeCents: next },
  });
  return toMatchDTO(matchId, userId);
}

export async function confirmStake(matchId: string, userId: string) {
  await assertPlayer(matchId, userId);
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new AppError("Match not found.", 404);
  if (match.status !== "ready") {
    throw new AppError("Stakes can only be locked on a ready match.");
  }
  await lockStakeInternal(matchId, userId);
  return toMatchDTO(matchId, userId);
}

async function lockStakeInternal(matchId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    const match = await tx.match.findUnique({
      where: { id: matchId },
      include: { players: true },
    });
    if (!match) throw new AppError("Match not found.", 404);
    const player = match.players.find((item) => item.userId === userId);
    if (!player) throw new AppError("You are not on this roster.", 403);
    if (player.stakeLocked) return;
    const updated = await tx.wallet.updateMany({
      where: { userId, balanceCents: { gte: match.stakeCents } },
      data: { balanceCents: { decrement: match.stakeCents } },
    });
    if (updated.count !== 1) {
      throw new AppError(
        `Not enough play money to lock ${formatPlayMoney(match.stakeCents)}.`,
      );
    }
    await tx.matchPlayer.update({
      where: { id: player.id },
      data: { stakeLocked: true },
    });
    await tx.ledgerEntry.create({
      data: {
        userId,
        matchId,
        type: "stake_debit",
        amountCents: -match.stakeCents,
        note: "Stake locked",
      },
    });
  });
}

export async function startMatch(matchId: string, userId: string) {
  await assertPlayer(matchId, userId);
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: true },
  });
  if (!match) throw new AppError("Match not found.", 404);
  if (match.status !== "ready") {
    throw new AppError("Match can only start after the roster is funded.");
  }
  if (match.players.some((player) => !player.stakeLocked)) {
    throw new AppError("Every player must lock their stake first.");
  }
  const updated = await prisma.match.updateMany({
    where: { id: matchId, status: "ready" },
    data: { status: "in_match" },
  });
  if (updated.count !== 1) {
    throw new AppError("Match could not be started.");
  }
  return toMatchDTO(matchId, userId);
}

export async function recordScore(
  matchId: string,
  userId: string,
  teamAScore: number,
  teamBScore: number,
) {
  await assertPlayer(matchId, userId);
  if (
    !Number.isInteger(teamAScore) ||
    !Number.isInteger(teamBScore) ||
    teamAScore < 0 ||
    teamBScore < 0
  ) {
    throw new AppError("Scores must be whole numbers of 0 or more.");
  }
  const winner = winnerFromScores(teamAScore, teamBScore);
  if (winner === "tie") {
    throw new AppError("Ties are not used in v0. Play until one side wins.");
  }
  await prisma.match.update({
    where: { id: matchId },
    data: { teamAScore, teamBScore },
  });
  await settleMatch(matchId, winner, null);
  return toMatchDTO(matchId, userId);
}

export async function declareWinner(
  matchId: string,
  userId: string,
  team: TeamId,
) {
  await assertPlayer(matchId, userId);
  await settleMatch(matchId, team, null);
  return toMatchDTO(matchId, userId);
}

export async function forfeitMatch(matchId: string, userId: string) {
  const player = await assertPlayer(matchId, userId);
  await settleMatch(matchId, oppositeTeam(player.team as TeamId), userId);
  return toMatchDTO(matchId, userId);
}

async function settleMatch(
  matchId: string,
  winningTeam: TeamId,
  forfeitedById: string | null,
) {
  await prisma.$transaction(async (tx) => {
    const match = await tx.match.findUnique({
      where: { id: matchId },
      include: { players: true },
    });
    if (!match) throw new AppError("Match not found.", 404);
    if (match.status !== "in_match") {
      throw new AppError("Only a live match can be settled.");
    }
    const winners = match.players.filter((player) => player.team === winningTeam);
    if (winners.length === 0) {
      throw new AppError("Winning side has no players.");
    }
    const total = potCents(match.stakeCents, match.players.length);
    const shares = splitPot(total, winners.length);
    const updated = await tx.match.updateMany({
      where: { id: matchId, status: "in_match" },
      data: {
        status: "settled",
        winningTeam,
        forfeitedById,
      },
    });
    if (updated.count !== 1) {
      throw new AppError("Match was already settled.");
    }
    for (const [index, winner] of winners.entries()) {
      const amount = shares[index] ?? 0;
      await tx.wallet.update({
        where: { userId: winner.userId },
        data: { balanceCents: { increment: amount } },
      });
      await tx.matchPlayer.update({
        where: { id: winner.id },
        data: { payoutCents: amount },
      });
      await tx.ledgerEntry.create({
        data: {
          userId: winner.userId,
          matchId,
          type: "payout_credit",
          amountCents: amount,
          note: `Winning side share · Team ${winningTeam}`,
        },
      });
    }
    for (const player of match.players) {
      if (player.team === winningTeam) continue;
      await tx.matchPlayer.update({
        where: { id: player.id },
        data: { payoutCents: 0 },
      });
    }
  });
}

export async function rematch(matchId: string, userId: string) {
  const source = await prisma.match.findUnique({
    where: { id: matchId },
    include: { players: true },
  });
  if (!source) throw new AppError("Match not found.", 404);
  if (source.status !== "settled" && source.status !== "void") {
    throw new AppError("Rematch is available after the pot is settled.");
  }
  await assertPlayer(matchId, userId);
  const next = await createMatch(userId, source.mode);
  await prisma.match.update({
    where: { id: next.id },
    data: { rematchOfId: matchId, stakeCents: source.stakeCents },
  });
  return toMatchDTO(next.id, userId);
}

export async function getMatchDTO(matchId: string, userId: string) {
  return toMatchDTO(matchId, userId);
}

async function assertPlayer(matchId: string, userId: string) {
  const player = await prisma.matchPlayer.findUnique({
    where: { matchId_userId: { matchId, userId } },
  });
  if (!player) throw new AppError("You are not on this roster.", 403);
  return player;
}

async function toMatchDTO(matchId: string, userId: string): Promise<MatchDTO> {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      players: { include: { user: true }, orderBy: [{ team: "asc" }, { slot: "asc" }] },
    },
  });
  if (!match) throw new AppError("Match not found.", 404);
  if (!isMode(match.mode)) throw new AppError("Invalid match mode.");
  const you = match.players.find((player) => player.userId === userId);
  if (!you) throw new AppError("You are not on this roster.", 403);

  const players: PlayerDTO[] = match.players.map((player) => ({
    id: player.id,
    userId: player.userId,
    displayName: player.user.displayName,
    isBot: player.user.isBot,
    team: player.team as TeamId,
    slot: player.slot,
    isReady: player.isReady,
    stakeLocked: player.stakeLocked,
    isRandomFill: player.isRandomFill,
    payoutCents: player.payoutCents,
  }));

  const size = teamSize(match.mode);
  const slots: SlotDTO[] = [];
  for (const team of ["A", "B"] as TeamId[]) {
    for (let slot = 1; slot <= size; slot++) {
      slots.push({
        team,
        slot,
        player:
          players.find((player) => player.team === team && player.slot === slot) ??
          null,
      });
    }
  }

  return {
    id: match.id,
    code: match.code,
    mode: match.mode,
    status: match.status as MatchStatus,
    stakeCents: match.stakeCents,
    potCents: potCents(match.stakeCents, Math.max(players.length, rosterSize(match.mode))),
    teamAScore: match.teamAScore,
    teamBScore: match.teamBScore,
    winningTeam: (match.winningTeam as TeamId | null) ?? null,
    voidReason: match.voidReason,
    forfeitedById: match.forfeitedById,
    createdById: match.createdById,
    you: {
      userId,
      team: you.team as TeamId,
      slot: you.slot,
      isReady: you.isReady,
      stakeLocked: you.stakeLocked,
      isHost: match.createdById === userId,
    },
    slots,
    players,
    rosterFull: players.length >= rosterSize(match.mode),
    allReady: players.length >= rosterSize(match.mode) && players.every((p) => p.isReady),
    allFunded: players.length >= rosterSize(match.mode) && players.every((p) => p.stakeLocked),
    inviteCode: match.code,
  };
}
