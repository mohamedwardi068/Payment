import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export function CartSummary() {
  const { subtotal, itemCount } = useCart();

  // Mock shipping and tax for display
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
          <span className="font-medium text-card-foreground">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium text-card-foreground">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium text-card-foreground">
            ${tax.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-card-foreground">
              Total
            </span>
            <span className="text-xl font-bold text-card-foreground">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {subtotal < 100 && (
        <p className="mt-4 text-xs text-muted-foreground">
          Add ${(100 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}

      <Button asChild className="mt-6 w-full" size="lg" disabled={itemCount === 0}>
        <Link to="/checkout">
          Proceed to Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
