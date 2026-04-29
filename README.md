# Meu ZapPedido

MicroSaaS de cardapio digital com pedidos direto no WhatsApp para pequenos negocios de comida.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- React Hook Form + Zod
- Lucide React
- Deploy na Vercel

> Este projeto nao usa Firebase. A Vercel hospeda o app Next.js; Supabase fica responsavel por autenticacao e banco PostgreSQL.

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Copie `.env.example` para `.env.local` e configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3010
```

3. No Supabase SQL Editor, execute `supabase/schema.sql`.

4. Rode o projeto:

```bash
npm run dev -- -H 127.0.0.1 --port 3010
```

## Observacoes de producao

- Para o cadastro criar loja e entrar direto no painel, deixe a confirmacao obrigatoria de e-mail desativada no Supabase Auth ou adapte o fluxo para confirmar e-mail antes de criar a loja.
- As politicas RLS estao em `supabase/schema.sql`: donos gerenciam apenas seus dados, visitantes leem cardapios publicos e clientes podem criar pedidos.
- O envio do pedido salva o registro em `orders` e abre `https://wa.me/{numero}?text={mensagem}` com telefone sanitizado.

## Deploy na Vercel

1. Importe este projeto na Vercel.
2. Configure as variaveis de ambiente no painel da Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

3. Execute `supabase/schema.sql` no SQL Editor do Supabase antes de usar o cadastro.
4. Faca o deploy. A Vercel usara `npm install` e `npm run build`, conforme `vercel.json`.
