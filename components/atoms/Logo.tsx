import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/dashboard"
      className="text-[22px] font-semibold tracking-tight text-[#4a942e]"
    >
      SmartShopping
    </Link>
  );
}
