import Link from "next/link";
import type { AiProduct } from "@/services/ai-product.service";

type ProductCardProps = {
  product: AiProduct;
};

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {product.image ? (
          // Catalog images can be served by arbitrary upload providers.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true" className="text-4xl text-zinc-400">
            ◇
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500">
          {product.category ? <span>{product.category}</span> : null}
          {product.category && product.brand ? <span aria-hidden="true">•</span> : null}
          {product.brand ? <span>{product.brand}</span> : null}
        </div>

        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {product.name}
        </h3>

        {product.description ? (
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {priceFormatter.format(product.price)}
          </p>
          {product.stock !== undefined ? (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                product.stock
                  ? "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              {product.stock ? "In stock" : "Out of stock"}
            </span>
          ) : null}
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4a942e] dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          View product
        </Link>
      </div>
    </article>
  );
}
