import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">No products available</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Check back later for new items
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
