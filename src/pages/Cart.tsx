import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { items } = useCart();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
            <p className="mt-2 text-muted-foreground">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} ${items.length === 1 ? "item" : "items"} in your cart`}
            </p>
          </div>

          <Button variant="ghost" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              Your cart is empty
            </h2>
            <p className="mt-2 text-muted-foreground">
              Add some products to get started
            </p>
            <Button asChild className="mt-6">
              <Link to="/">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
