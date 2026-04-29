"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, authSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export type ActionState = { ok: boolean; message?: string };

async function uniqueSlug(base: string) {
  const supabase = await createClient();
  let slug = slugify(base) || "minha-loja";
  let candidate = slug;
  let suffix = 2;
  while (true) {
    const { data } = await supabase.from("businesses").select("id").eq("slug", candidate).maybeSingle();
    if (!data) return candidate;
    candidate = `${slug}-${suffix++}`;
  }
}

export async function registerAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };

  const supabase = await createClient();
  const { name, email, password, businessName, whatsappNumber, category } = parsed.data;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } }
  });

  if (error || !data.user) return { ok: false, message: error?.message || "Nao foi possivel criar sua conta." };

  const slug = await uniqueSlug(businessName);
  const profile = await supabase.from("profiles").upsert({ id: data.user.id, name, email });
  if (profile.error) return { ok: false, message: profile.error.message };

  const business = await supabase.from("businesses").insert({
    owner_id: data.user.id,
    name: businessName,
    slug,
    category,
    whatsapp_number: whatsappNumber
  });
  if (business.error) return { ok: false, message: business.error.message };

  redirect("/dashboard");
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: parsed.error.errors[0]?.message };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: "E-mail ou senha invalidos." };
  redirect("/dashboard");
}

export async function forgotPasswordAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") || "");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Enviamos as instrucoes para seu e-mail." };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
