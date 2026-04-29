import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres.")
});

export const registerSchema = authSchema.extend({
  name: z.string().min(2, "Informe seu nome."),
  businessName: z.string().min(2, "Informe o nome do negocio."),
  whatsappNumber: z.string().min(10, "Informe um WhatsApp valido."),
  category: z.string().min(2, "Informe a categoria.")
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Informe o nome da categoria."),
  description: z.string().optional().nullable(),
  is_active: z.boolean().default(true)
});

export const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Informe o nome do produto."),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Informe um preco valido."),
  category_id: z.string().optional().nullable(),
  image_url: z.string().url("Informe uma URL valida.").optional().or(z.literal("")).nullable(),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false)
});

export const businessSchema = z.object({
  name: z.string().min(2, "Informe o nome do negocio."),
  slug: z.string().min(2, "Informe um link valido.").regex(/^[a-z0-9-]+$/, "Use apenas letras, numeros e hifens."),
  whatsapp_number: z.string().min(10, "Informe um WhatsApp valido."),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  delivery_fee: z.coerce.number().min(0).default(0),
  minimum_order: z.coerce.number().min(0).default(0),
  is_open: z.boolean().default(true),
  logo_url: z.string().url("Informe uma URL valida.").optional().or(z.literal("")).nullable(),
  banner_url: z.string().url("Informe uma URL valida.").optional().or(z.literal("")).nullable(),
  primary_color: z.string().default("#ef4444")
});

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Informe seu nome."),
  customer_phone: z.string().min(10, "Informe seu telefone."),
  delivery_type: z.enum(["Entrega", "Retirada"]),
  address: z.string().optional(),
  payment_method: z.enum(["PIX", "Dinheiro", "Cartao"]),
  change_for: z.string().optional(),
  notes: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.delivery_type === "Entrega" && !data.address?.trim()) {
    ctx.addIssue({ code: "custom", path: ["address"], message: "Informe o endereco para entrega." });
  }
});
