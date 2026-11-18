"use client";

import { useAuth } from "@/context/AuthContext";
import { firstPermittedPage } from "@/lib/rbac/permissions";
import Link from "next/link";

export function Logo() {
  const { user } = useAuth();
  return (
    <Link
      href={firstPermittedPage(user)}
      className="text-[22px] font-semibold tracking-tight text-[#4a942e]"
    >
      Home
    </Link>
  );
}
