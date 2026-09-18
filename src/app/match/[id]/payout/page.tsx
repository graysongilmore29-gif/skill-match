import type { Metadata } from "next";
import { PayoutView } from "@/components/PayoutView";

export const metadata: Metadata = {
  title: "Pot settled",
};

export default async function PayoutPage({
  params,
}: PageProps<"/match/[id]/payout">) {
  const { id } = await params;
  return <PayoutView matchId={id} />;
}
