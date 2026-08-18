import { Spinner } from "@/components/atoms/Spinner";

export default function UsersLoading() {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <Spinner />
    </div>
  );
}
