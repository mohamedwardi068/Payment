import { api } from "./api";
import type { Product } from "@/types";

export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>("/products");
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },
};
