import { AccessDenied } from "@/components/templates/AccessDenied";
import { AppLayout } from "@/components/templates/AppLayout";

export default function NoAccessPage() {
  return <AppLayout><AccessDenied /></AppLayout>;
}
