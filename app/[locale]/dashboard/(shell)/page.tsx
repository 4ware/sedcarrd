import { getSession } from "@/features/auth/server";
import { DashboardOverview } from "@/features/dashboard";
import { PeopleList } from "@/features/people";

export default async function DashboardPage() {
  // The layout already guarantees a session; getSession() is deduplicated per request.
  const session = await getSession();
  return (
    <DashboardOverview name={session?.user.name ?? ""}>
      <PeopleList />
    </DashboardOverview>
  );
}
