import { StaticAdminFormPage } from "@/components/organisms/StaticAdminFormPage";
import {
  getAdminStaticFormConfig,
  type StaticFormKey,
} from "@/lib/admin-static-forms";

export function AdminStaticFormRoute({
  formKey,
  mode,
}: {
  formKey: StaticFormKey;
  mode: "create" | "edit";
}) {
  return <StaticAdminFormPage config={getAdminStaticFormConfig(formKey, mode)} />;
}
