"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { FormField } from "@/components/molecules/FormField";
import { Modal } from "@/components/molecules/Modal";
import { PermissionMatrix } from "@/components/molecules/PermissionMatrix";
import { ApiError } from "@/lib/api-client";
import { fetchRole, formatRoleId, saveRole, updateRoleStatus } from "@/lib/roles-api";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { isAdmin } from "@/lib/rbac/permissions";
import type { Role, RoleInput } from "@/types/role";

export function RoleDetailContainer({ roleId }: { roleId: string }) {
  const { user, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<RoleInput | null>(null);
  const [nameError, setNameError] = useState<string | undefined>();
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let ignore = false;
    // Reset the loading state for this API request.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null); setRole(null);
    fetchRole(roleId).then((data) => { if (!ignore) setRole(data); })
      .catch((err: unknown) => {
        if (!ignore) setError(err instanceof ApiError && err.status === 404 ? "Role not found." : err instanceof Error ? err.message : "Could not load role.");
      }).finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [roleId, retry]);

  async function toggleStatus() {
    if (!role || !role.status || role.systemKey === "admin" || !isAdmin(user) || pending) return;
    setPending(true); setError(null);
    try {
      setRole(await updateRoleStatus(role.id, role.status === "active" ? "inactive" : "active"));
      showToast("Role status updated successfully.");
      await refreshProfile();
    } catch (err) { showToast(err instanceof Error ? err.message : "Could not update role status.", "error"); }
    finally { setPending(false); }
  }

  async function submitUpdate(event: React.FormEvent) {
    event.preventDefault();
    if (!role || !draft || pending || role.systemKey === "admin" || !isAdmin(user)) return;
    const name = draft.name.trim();
    if (!name) { setNameError("Role name is required"); return; }
    if (!draft.status) { showToast("Select a role status.", "error"); return; }
    setPending(true); setNameError(undefined);
    try {
      const updated = await saveRole({ ...draft, name }, role.id);
      setRole(updated);
      setDraft(null);
      showToast("Role updated successfully.");
      await refreshProfile();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not update role.", "error");
    } finally { setPending(false); }
  }

  return (
    <section className="max-w-3xl space-y-6">
      <Link href="/roles" className="text-sm text-green-700 hover:underline">Back to roles</Link>
      {loading ? <Spinner /> : (
        <>
          {error && <div role="alert" className="space-y-2 text-red-600"><p>{error}</p>{!role && <Button variant="secondary" onClick={() => setRetry((value) => value + 1)}>Retry</Button>}</div>}
          {role && (
            <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div><p className="text-sm text-zinc-500">{formatRoleId(role.id)}</p><h1 className="mt-1 text-2xl font-semibold">{role.name}</h1></div>
                <Badge tone={role.status === "active" ? "success" : "neutral"}>{role.status ?? "Not provided"}</Badge>
              </div>
              <div><h2 className="mb-3 text-lg font-semibold">Menu permissions</h2><PermissionMatrix permissions={role.permissions} disabled onChange={() => {}} /></div>
              {role.systemKey !== "admin" && <Button disabled={pending} onClick={() => { setNameError(undefined); setDraft({ name: role.name, permissions: role.permissions, status: role.status ?? undefined }); }}>Edit role</Button>}
              {role.systemKey === "admin" ? <p className="text-sm text-zinc-500">The built-in Admin role is protected.</p> : role.status ? <Button variant="secondary" disabled={pending} onClick={() => void toggleStatus()}>{pending ? "Updating..." : role.status === "active" ? "Deactivate role" : "Activate role"}</Button> : <p className="text-sm text-zinc-500">The API did not provide a role status.</p>}
            </div>
          )}
        </>
      )}
      <Modal open={draft !== null} title="Edit role" onClose={() => { if (!pending) setDraft(null); }}>
        {draft && <form onSubmit={submitUpdate} className="space-y-5" noValidate>
          <FormField id="edit-role-name" label="Role name" value={draft.name} error={nameError} disabled={pending} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <div className="space-y-1.5">
            <label htmlFor="edit-role-status" className="text-sm font-medium">Status</label>
            <select id="edit-role-status" value={draft.status ?? ""} disabled={pending} onChange={(event) => setDraft({ ...draft, status: event.target.value === "inactive" ? "inactive" : "active" })} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
              <option value="" disabled>Select status</option>
              <option value="active">Active</option><option value="inactive">Inactive</option>
            </select>
          </div>
          <PermissionMatrix permissions={draft.permissions} disabled={pending} onChange={(permissions) => setDraft({ ...draft, permissions })} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" disabled={pending} onClick={() => setDraft(null)}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving..." : "Save changes"}</Button>
          </div>
        </form>}
      </Modal>
    </section>
  );
}
