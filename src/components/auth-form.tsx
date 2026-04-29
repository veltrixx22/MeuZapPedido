"use client";

import { useActionState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction, registerAction, forgotPasswordAction, type ActionState } from "@/app/actions/auth";
import { authSchema, registerSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initial: ActionState = { ok: false };

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, initial);
  const form = useForm<z.infer<typeof authSchema>>({ resolver: zodResolver(authSchema) });
  return (
    <form action={action} className="space-y-4">
      <div><Label>E-mail</Label><Input type="email" required {...form.register("email")} /></div>
      <div><Label>Senha</Label><Input type="password" required {...form.register("password")} /></div>
      {state.message ? <p className="text-sm text-red-300">{state.message}</p> : null}
      <Button disabled={pending} className="w-full">{pending ? "Entrando..." : "Entrar"}</Button>
      <Link href="/forgot-password" className="block text-center text-sm text-zinc-400 hover:text-white">Esqueci minha senha</Link>
    </form>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);
  const form = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });
  return (
    <form action={action} className="grid gap-4 md:grid-cols-2">
      <div><Label>Seu nome</Label><Input required {...form.register("name")} /></div>
      <div><Label>E-mail</Label><Input type="email" required {...form.register("email")} /></div>
      <div><Label>Senha</Label><Input type="password" minLength={6} required {...form.register("password")} /></div>
      <div><Label>Nome do negocio</Label><Input required {...form.register("businessName")} /></div>
      <div><Label>WhatsApp</Label><Input placeholder="(11) 99999-9999" required {...form.register("whatsappNumber")} /></div>
      <div><Label>Categoria</Label><Input placeholder="Hamburgueria, pizzaria..." required {...form.register("category")} /></div>
      {state.message ? <p className="md:col-span-2 text-sm text-red-300">{state.message}</p> : null}
      <Button disabled={pending} className="md:col-span-2">{pending ? "Criando..." : "Criar conta e loja"}</Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);
  return (
    <form action={action} className="space-y-4">
      <div><Label>E-mail</Label><Input name="email" type="email" required /></div>
      {state.message ? <p className={`text-sm ${state.ok ? "text-emerald-300" : "text-red-300"}`}>{state.message}</p> : null}
      <Button disabled={pending} className="w-full">{pending ? "Enviando..." : "Enviar recuperacao"}</Button>
    </form>
  );
}
