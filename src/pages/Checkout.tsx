import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function Checkout() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Your cart is empty
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add some products before checkout
          </p>
          <Button asChild className="mt-6">
            <Link to="/">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
            <p className="mt-2 text-muted-foreground">
              Complete your purchase
            </p>
          </div>

          <Button variant="ghost" asChild>
            <Link to="/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <CheckoutForm />
          </div>

          <div className="order-1 lg:order-2">
            <div className="sticky top-24">
              <OrderSummary />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
