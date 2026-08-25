import { Button } from "@/components/atoms/Button";
import { Text } from "@/components/atoms/Text";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Text as="h1" className="text-4xl font-bold">
        404
      </Text>
      <Text className="text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t find the page you&apos;re looking for.
      </Text>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
