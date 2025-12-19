export interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaymentDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardHolder: string;
}

export interface CheckoutRequest {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  payment: PaymentDetails;
}

export interface OrderResponse {
  orderId: string;
  status: "paid" | "failed";
  total: number;
  message?: string;
}

export interface Order {
  orderId: string;
  status: string;
  total: number;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}
