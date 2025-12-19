import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  const handleDecrease = () => {
    updateQuantity(product._id, quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      updateQuantity(product._id, quantity + 1);
    }
  };

  const handleRemove = () => {
    removeItem(product._id);
  };

  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-border/80 animate-fade-in">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-card-foreground">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ${product.price.toFixed(2)} each
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrease}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-8 text-center font-medium text-card-foreground">
              {quantity}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrease}
              disabled={quantity >= product.stock}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <span className="text-lg font-bold text-card-foreground">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
