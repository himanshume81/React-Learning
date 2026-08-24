import { Text } from "@/components/atoms/Text";
import type { Product } from "@/types/product";

type ProductItemProps = {
  product: Product;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductItem({ product }: ProductItemProps) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-w-0 flex-1">
        <Text as="h3" className="font-medium">
          {product.name}
        </Text>
        <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {product.description}
        </Text>
        <Text className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          {product.categoryName}
        </Text>
      </div>
      <Text className="shrink-0 text-sm font-semibold">
        {formatPrice(product.price)}
      </Text>
    </li>
  );
}
