import type { Mode, MatchStatus, TeamId } from "./match-rules";

export type PlayerDTO = {
  id: string;
  userId: string;
  displayName: string;
  isBot: boolean;
  team: TeamId;
  slot: number;
  isReady: boolean;
  stakeLocked: boolean;
  isRandomFill: boolean;
  payoutCents: number | null;
};

export type SlotDTO = {
  team: TeamId;
  slot: number;
  player: PlayerDTO | null;
};

export type MatchDTO = {
  id: string;
  code: string;
  mode: Mode;
  status: MatchStatus;
  stakeCents: number;
  potCents: number;
  teamAScore: number | null;
  teamBScore: number | null;
  winningTeam: TeamId | null;
  voidReason: string | null;
  forfeitedById: string | null;
  createdById: string;
  you: {
    userId: string;
    team: TeamId | null;
    slot: number | null;
    isReady: boolean;
    stakeLocked: boolean;
    isHost: boolean;
  };
  slots: SlotDTO[];
  players: PlayerDTO[];
  rosterFull: boolean;
  allReady: boolean;
  allFunded: boolean;
  inviteCode: string;
};

export type MeDTO = {
  user: {
    id: string;
    email: string;
    displayName: string;
    isBot: boolean;
  } | null;
  wallet: { balanceCents: number } | null;
  activeMatch: { id: string; status: MatchStatus; mode: Mode } | null;
};

export type ApiError = { error: string };
