import type { Metadata } from "next";
import { WagerView } from "@/components/WagerView";

export const metadata: Metadata = {
  title: "Lock your stake",
};

export default async function WagerPage({
  params,
}: PageProps<"/match/[id]/wager">) {
  const { id } = await params;
  return <WagerView matchId={id} />;
}
