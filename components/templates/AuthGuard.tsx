"use client";

import { Spinner } from "@/components/atoms/Spinner";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

// Client-side only: this repo has no backend/session cookie, so there's
// nothing for Next.js middleware to check server-side. This guards the UI,
// not the route — the page HTML is still served before the redirect fires.
export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
