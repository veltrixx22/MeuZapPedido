import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Meu ZapPedido",
  description: "Cardapio digital com pedidos direto no WhatsApp para pequenos negocios de comida."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
