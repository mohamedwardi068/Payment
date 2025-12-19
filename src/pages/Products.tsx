import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductGrid } from "@/components/products/ProductGrid";
import { productService } from "@/services/productService";
import type { Product } from "@/types";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our selection of products
          </p>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <ProductGrid products={products} isLoading={isLoading} />
        )}
      </div>
    </Layout>
  );
}
