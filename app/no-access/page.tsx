import { AppLayout } from "@/components/templates/AppLayout";
export default function NoAccessPage() {
  return <AppLayout><h1 className="text-xl font-semibold">No access assigned</h1><p className="mt-2 text-zinc-500">Ask an administrator to assign a role with menu access.</p></AppLayout>;
}
