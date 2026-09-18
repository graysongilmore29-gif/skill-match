import type { Metadata } from "next";
import { PlayView } from "@/components/PlayView";

export const metadata: Metadata = {
  title: "Match live",
};

export default async function PlayPage({
  params,
}: PageProps<"/match/[id]/play">) {
  const { id } = await params;
  return <PlayView matchId={id} />;
}
