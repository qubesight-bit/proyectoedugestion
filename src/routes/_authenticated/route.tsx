import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { requireStaffAccount } from "@/lib/access";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const user = await requireStaffAccount();
    if (!user) throw redirect({ to: "/auth" });
    return { user };
  },
  component: () => <Outlet />,
});
