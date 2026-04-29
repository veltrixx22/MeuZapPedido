"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getOwnerBusiness } from "@/lib/data";
import { businessSchema, categorySchema, productSchema } from "@/lib/validations";
import type { ActionState } from "./auth";

function nullableText(value: unknown) {
  const text = String(value ?? "").trim();
  return text ? text : null;
}

export async function upsertCategoryAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const parsed = categorySchema.safeParse({
    id: nullableText(formData.get("id")),
    name: formData.get("name"),
    description: nullableText(formData.get("description")),
    is_active: formData.get("is_active") === "on"
  });
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };

  const supabase = await createClient();
  const payload = { ...parsed.data, business_id: business.id };
  const result = parsed.data.id
    ? await supabase.from("categories").update(payload).eq("id", parsed.data.id).eq("business_id", business.id)
    : await supabase.from("categories").insert(payload);
  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/dashboard/categories");
  revalidatePath(`/cardapio/${business.slug}`);
  return { ok: true, message: "Categoria salva." };
}

export async function deleteCategoryAction(id: string): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id).eq("business_id", business.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/categories");
  return { ok: true };
}

export async function upsertProductAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const parsed = productSchema.safeParse({
    id: nullableText(formData.get("id")),
    name: formData.get("name"),
    description: nullableText(formData.get("description")),
    price: formData.get("price"),
    category_id: nullableText(formData.get("category_id")),
    image_url: nullableText(formData.get("image_url")),
    is_available: formData.get("is_available") === "on",
    is_featured: formData.get("is_featured") === "on"
  });
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };

  const supabase = await createClient();
  const payload = { ...parsed.data, business_id: business.id };
  const result = parsed.data.id
    ? await supabase.from("products").update(payload).eq("id", parsed.data.id).eq("business_id", business.id)
    : await supabase.from("products").insert(payload);
  if (result.error) return { ok: false, message: result.error.message };
  revalidatePath("/dashboard/products");
  revalidatePath(`/cardapio/${business.slug}`);
  return { ok: true, message: "Produto salvo." };
}

export async function deleteProductAction(id: string): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id).eq("business_id", business.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/products");
  return { ok: true };
}

export async function updateBusinessAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const parsed = businessSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    whatsapp_number: formData.get("whatsapp_number"),
    category: nullableText(formData.get("category")),
    description: nullableText(formData.get("description")),
    address: nullableText(formData.get("address")),
    delivery_fee: formData.get("delivery_fee"),
    minimum_order: formData.get("minimum_order"),
    is_open: formData.get("is_open") === "on",
    logo_url: nullableText(formData.get("logo_url")),
    banner_url: nullableText(formData.get("banner_url")),
    primary_color: formData.get("primary_color") || "#ef4444"
  });
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", business.id)
    .maybeSingle();
  if (existing) return { ok: false, message: "Este link ja esta em uso." };

  const { error } = await supabase.from("businesses").update(parsed.data).eq("id", business.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/appearance");
  revalidatePath(`/cardapio/${parsed.data.slug}`);
  return { ok: true, message: "Configuracoes salvas." };
}

export async function updateOrderStatusAction(id: string, status: string): Promise<ActionState> {
  const business = await getOwnerBusiness();
  if (!business) return { ok: false, message: "Negocio nao encontrado." };
  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id).eq("business_id", business.id);
  if (error) return { ok: false, message: error.message };
  revalidatePath("/dashboard/orders");
  return { ok: true };
}
