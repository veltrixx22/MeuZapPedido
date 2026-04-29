import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Business, Category, Order, Product } from "@/lib/types";

export async function getSessionUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function getOwnerBusiness() {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Business | null;
}

export async function getDashboardData() {
  const business = await getOwnerBusiness();
  if (!business) return { business: null, categories: [], products: [], orders: [] };
  const supabase = await createClient();
  const [categories, products, orders] = await Promise.all([
    supabase.from("categories").select("*").eq("business_id", business.id).order("sort_order"),
    supabase.from("products").select("*").eq("business_id", business.id).order("created_at", { ascending: false }),
    supabase.from("orders").select("*").eq("business_id", business.id).order("created_at", { ascending: false }).limit(12)
  ]);

  if (categories.error) throw new Error(categories.error.message);
  if (products.error) throw new Error(products.error.message);
  if (orders.error) throw new Error(orders.error.message);

  return {
    business,
    categories: categories.data as Category[],
    products: products.data as Product[],
    orders: orders.data as Order[]
  };
}

export async function getPublicMenu(slug: string) {
  const supabase = await createClient();
  const { data: business, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!business) return null;

  const [categories, products] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("business_id", business.id)
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select("*")
      .eq("business_id", business.id)
      .eq("is_available", true)
      .order("sort_order")
  ]);

  if (categories.error) throw new Error(categories.error.message);
  if (products.error) throw new Error(products.error.message);

  return {
    business: business as Business,
    categories: categories.data as Category[],
    products: products.data as Product[]
  };
}
