import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMatchDTO } from "@/lib/match-service";
import { pathForStatus } from "@/lib/match-rules";

export const dynamic = "force-dynamic";

export default async function MatchIndexPage({
  params,
}: PageProps<"/match/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/");
  let match;
  try {
    match = await getMatchDTO(id, user.id);
  } catch {
    redirect("/");
  }
  redirect(pathForStatus(match.id, match.status));
}
