import { SetPasswordForm } from "@/components/organisms/SetPasswordForm";
import { Suspense } from "react";

export default function SetupPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <Suspense fallback={null}>
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
