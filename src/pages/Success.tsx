import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Package, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { orderService } from "@/services/orderService";
import type { Order } from "@/types";

export default function Success() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("No order ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const data = await orderService.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-destructive">{error || "Order not found"}</p>
          <Button asChild className="mt-6">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-foreground">
            Payment Successful!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order
          </p>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-medium text-card-foreground">
                {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-primary">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="h-5 w-5" />
              <span className="text-sm">Order Items</span>
            </div>

            <div className="divide-y divide-border">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-card-foreground">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-medium text-card-foreground">
                    ${(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
