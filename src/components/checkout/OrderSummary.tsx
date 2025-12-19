import { useCart } from "@/context/CartContext";

export function OrderSummary() {
  const { items, subtotal } = useCart();

  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-card-foreground">Your Order</h2>

      <div className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.product._id}
            className="flex items-center gap-4 py-4 first:pt-0"
          >
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-card-foreground">
                {item.product.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Qty: {item.quantity} × ${item.product.price.toFixed(2)}
              </p>
            </div>
            <span className="font-medium text-card-foreground">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-card-foreground">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-card-foreground">
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="text-card-foreground">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-base font-semibold text-card-foreground">
            Total
          </span>
          <span className="text-xl font-bold text-primary">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
