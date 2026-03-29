export interface Product {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  supplier_id: number;
  cost_price: number;
  retail_price: number;
  reorder_level: number;
  stock_quantity: number;
  expiry_date: string;
}

export type ProductInsertPayload = Omit<Product, 'id'>;
export type ProductUpdatePayload = Product;
