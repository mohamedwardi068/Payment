import { api } from "./api";
import type { CheckoutRequest, OrderResponse, Order } from "@/types";

export const orderService = {
  async checkout(data: CheckoutRequest): Promise<OrderResponse> {
    const response = await api.post<OrderResponse>("/orders/checkout", data);
    return response.data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },
};
