import { LoginForm } from "@/components/organisms/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
