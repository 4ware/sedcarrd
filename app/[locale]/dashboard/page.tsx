import { getSession } from "@/features/auth/server";
import { DashboardOverview } from "@/features/dashboard";

export default async function DashboardPage() {
  // The layout already guarantees a session; getSession() is deduplicated per request.
  const session = await getSession();
  return <DashboardOverview name={session?.user.name ?? ""} />;
}
