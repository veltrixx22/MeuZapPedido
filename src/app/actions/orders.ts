"use server";

import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validations";
import { currency, sanitizeWhatsApp } from "@/lib/utils";
import type { Business, OrderItem } from "@/lib/types";

export async function createPublicOrder(input: {
  business: Business;
  items: OrderItem[];
  checkout: Record<string, string>;
}) {
  const parsed = checkoutSchema.safeParse(input.checkout);
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };
  if (!input.items.length) return { ok: false, message: "Adicione pelo menos um item ao pedido." };

  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (input.business.minimum_order > 0 && subtotal < input.business.minimum_order) {
    return { ok: false, message: `Pedido minimo de ${currency(input.business.minimum_order)}.` };
  }

  const deliveryFee = parsed.data.delivery_type === "Entrega" ? Number(input.business.delivery_fee || 0) : 0;
  const total = subtotal + deliveryFee;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      business_id: input.business.id,
      customer_name: parsed.data.customer_name,
      customer_phone: parsed.data.customer_phone,
      delivery_type: parsed.data.delivery_type,
      address: parsed.data.address || null,
      payment_method: parsed.data.payment_method,
      notes: parsed.data.notes || null,
      items: input.items,
      subtotal,
      delivery_fee: deliveryFee,
      total
    })
    .select("id")
    .single();

  if (error) return { ok: false, message: "Nao foi possivel salvar o pedido. Tente novamente." };

  const shortId = String(data.id).slice(0, 8).toUpperCase();
  const itemLines = input.items.map((item) => `${item.quantity}x ${item.name} - ${currency(item.price * item.quantity)}`).join("\n");
  const message = [
    "Ola, vim pelo Meu ZapPedido e gostaria de fazer um pedido:",
    "",
    `*Pedido #${shortId}*`,
    "",
    `*Cliente:* ${parsed.data.customer_name}`,
    `*Telefone:* ${parsed.data.customer_phone}`,
    "",
    "*Itens:*",
    itemLines,
    "",
    `*Subtotal:* ${currency(subtotal)}`,
    `*Entrega:* ${currency(deliveryFee)}`,
    `*Total:* ${currency(total)}`,
    "",
    `*Tipo de pedido:* ${parsed.data.delivery_type}`,
    parsed.data.delivery_type === "Entrega" ? `*Endereco:* ${parsed.data.address}` : null,
    "",
    `*Pagamento:* ${parsed.data.payment_method}${parsed.data.change_for ? ` - troco para ${parsed.data.change_for}` : ""}`,
    parsed.data.notes ? `\n*Observacoes:*\n${parsed.data.notes}` : null
  ].filter(Boolean).join("\n");

  const phone = sanitizeWhatsApp(input.business.whatsapp_number);
  return { ok: true, url: `https://wa.me/${phone}?text=${encodeURIComponent(message)}` };
}
