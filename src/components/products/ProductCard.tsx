import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { items, addItem } = useCart();
  
  const cartItem = items.find((item) => item.product._id === product._id);
  const isInCart = !!cartItem;
  const isOutOfStock = product.stock === 0;
  const reachedMax = cartItem?.quantity === product.stock;

  const handleAddToCart = () => {
    if (!isOutOfStock && !reachedMax) {
      addItem(product);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">
          {product.name}
        </h3>
        
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-card-foreground">
              ${product.price.toFixed(2)}
            </span>
            {isOutOfStock ? (
              <span className="text-xs text-destructive">Out of stock</span>
            ) : (
              <span className="text-xs text-muted-foreground">
                {product.stock} in stock
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || reachedMax}
            size="sm"
            className="transition-all duration-200"
            variant={isInCart ? "secondary" : "default"}
          >
            {isInCart ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="mr-1 h-4 w-4" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
