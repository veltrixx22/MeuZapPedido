export type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
};

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string | null;
  whatsapp_number: string;
  logo_url: string | null;
  banner_url: string | null;
  description: string | null;
  address: string | null;
  delivery_fee: number;
  minimum_order: number;
  is_open: boolean;
  opening_hours: Record<string, unknown> | null;
  primary_color: string;
  created_at: string;
};

export type Category = {
  id: string;
  business_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type Product = {
  id: string;
  business_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Order = {
  id: string;
  business_id: string;
  customer_name: string | null;
  customer_phone: string | null;
  delivery_type: string | null;
  address: string | null;
  payment_method: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: "new" | "accepted" | "preparing" | "out_for_delivery" | "completed" | "canceled";
  created_at: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};
