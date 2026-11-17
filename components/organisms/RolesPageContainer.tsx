"use client";

import { useEffect, useState } from "react";
import { PermissionMatrix } from "@/components/molecules/PermissionMatrix";
import { Button } from "@/components/atoms/Button";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { Spinner } from "@/components/atoms/Spinner";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api-client";
import { fetchRoles, saveRole, updateRoleStatus } from "@/lib/roles-api";
import { emptyPermissions, isAdmin } from "@/lib/rbac/permissions";
import { RolesTable } from "@/components/organisms/RolesTable";
import type { Role, RoleInput } from "@/types/role";

function message(error: unknown) {
  if (error instanceof ApiError && error.status === 409) return `Conflict: ${error.message}`;
  return error instanceof Error ? error.message : "Could not complete this request. Please try again.";
}

export function RolesPageContainer() {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<RoleInput>({ name: "", permissions: emptyPermissions(), status: "active" });
  const [formError, setFormError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let ignore = false;
    // Reset loading/pagination for this external data request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    fetchRoles().then((data) => { if (!ignore) setRoles(data); })
      .catch((err: unknown) => { if (!ignore) setError(message(err)); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [retry]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!editorOpen || !isAdmin(user)) return;
    const name = form.name.trim();
    if (!name) { setNameError("Role name is required"); return; }
    setPending(true); setFormError(null); setNameError(undefined);
    try {
      const saved = await saveRole({ ...form, name });
      setRoles((current) => [...current, saved]);
      setEditorOpen(false); showToast("Role added successfully.");
      await refreshProfile();
    } catch (err) { setFormError(message(err)); }
    finally { setPending(false); }
  }

  async function toggleStatus(role: Role) {
    if (!isAdmin(user) || role.systemKey === "admin" || !role.status || updatingId) return;
    setUpdatingId(role.id); setError(null);
    try {
      const saved = await updateRoleStatus(role.id, role.status === "active" ? "inactive" : "active");
      setRoles((current) => current.map((item) => item.id === saved.id ? saved : item));
      showToast("Role status updated successfully.");
      await refreshProfile();
    } catch (err) { showToast(message(err), "error"); }
    finally { setUpdatingId(null); }
  }


  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Roles</h1>
        <Button disabled={pending} onClick={() => { setForm({ name: "", permissions: emptyPermissions(), status: "active" }); setFormError(null); setNameError(undefined); setEditorOpen(true); }}>Add role</Button>
      </div>
      {error && <div role="alert" className="space-y-2 text-red-600"><p>{error}</p><Button variant="secondary" onClick={() => setRetry((value) => value + 1)}>Retry</Button></div>}
      {loading ? <Spinner /> : !error && roles.length === 0 ? <p>No roles found. Create a role to get started.</p> : (
        <RolesTable roles={roles} updatingId={updatingId} onToggleStatus={(role) => void toggleStatus(role)} />
      )}
      <Modal open={editorOpen} title="Add role" onClose={() => { if (!pending) setEditorOpen(false); }}>
        <form onSubmit={submit} className="space-y-5" noValidate>
          <FormField id="role-name" label="Role name" value={form.name} error={nameError} onChange={(event) => setForm({ ...form, name: event.target.value })} disabled={pending} />
          <div className="space-y-1.5">
            <label htmlFor="role-status" className="text-sm font-medium">Status</label>
            <select id="role-status" value={form.status ?? "active"} disabled={pending} onChange={(event) => setForm({ ...form, status: event.target.value === "inactive" ? "inactive" : "active" })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <PermissionMatrix permissions={form.permissions} disabled={pending} onChange={(permissions) => setForm({ ...form, permissions })} />
          <p className="text-sm text-zinc-500">Only admins can manage users and roles. Add/Edit and Delete require View.</p>
          {formError && <p role="alert" className="text-sm text-red-600">{formError}</p>}
          <div className="flex justify-end gap-3"><Button type="button" variant="ghost" disabled={pending} onClick={() => setEditorOpen(false)}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? "Saving..." : "Add role"}</Button></div>
        </form>
      </Modal>

    </section>
  );
}
