import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { orderService } from "@/services/orderService";
import type { PaymentDetails } from "@/types";

interface FormErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardHolder?: string;
}

export function CheckoutForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PaymentDetails>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    } else if (name === "expiry") {
      formattedValue = formatExpiry(value);
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    const cardDigits = formData.cardNumber.replace(/\s/g, "");
    if (!cardDigits || cardDigits.length < 15) {
      newErrors.cardNumber = "Valid card number is required";
    }

    const expiryParts = formData.expiry.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      newErrors.expiry = "Valid expiry date is required (MM/YY)";
    } else {
      const month = parseInt(expiryParts[0], 10);
      if (month < 1 || month > 12) {
        newErrors.expiry = "Invalid month";
      }
    }

    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required";
    }

    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await orderService.checkout({
        items: items.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        payment: {
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiry: formData.expiry,
          cvv: formData.cvv,
          cardHolder: formData.cardHolder.trim(),
        },
      });

      if (response.status === "paid") {
        clearCart();
        toast({
          title: "Payment Successful",
          description: `Order ${response.orderId} has been placed.`,
        });
        navigate(`/success/${response.orderId}`);
      } else {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: response.message || "Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Payment Details
          </h2>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={formData.cardNumber}
              onChange={handleChange}
              className={errors.cardNumber ? "border-destructive" : ""}
            />
            {errors.cardNumber && (
              <p className="text-sm text-destructive">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={handleChange}
                className={errors.expiry ? "border-destructive" : ""}
              />
              {errors.expiry && (
                <p className="text-sm text-destructive">{errors.expiry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={formData.cvv}
                onChange={handleChange}
                className={errors.cvv ? "border-destructive" : ""}
              />
              {errors.cvv && (
                <p className="text-sm text-destructive">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardHolder">Cardholder Name</Label>
            <Input
              id="cardHolder"
              name="cardHolder"
              placeholder="John Doe"
              value={formData.cardHolder}
              onChange={handleChange}
              className={errors.cardHolder ? "border-destructive" : ""}
            />
            {errors.cardHolder && (
              <p className="text-sm text-destructive">{errors.cardHolder}</p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isLoading || items.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Your payment is secured with industry-standard encryption
      </p>
    </form>
  );
}
