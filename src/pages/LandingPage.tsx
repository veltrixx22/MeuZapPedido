import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useFirebase } from '@/lib/FirebaseProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap, MessageCircle, DollarSign, LogIn, Menu as MenuIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();

  if (user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-zinc-950 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <Zap className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black">Bem-vindo de volta!</h1>
          <p className="text-zinc-400">Você já está logado em sua conta.</p>
          <Button onClick={() => navigate('/dashboard')} size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-green-500/20">
            Ir para o Painel de Controle
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 selection:bg-green-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-xl text-white">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span>ZapPedido</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full hidden sm:flex" onClick={() => navigate('/register')}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-tight">
              Seu Cardápio Digital <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                no WhatsApp
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
          >
            Crie seu cardápio profissional em minutos, receba pedidos organizados direto no seu WhatsApp e aumente suas vendas sem pagar taxas abusivas de entrega.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <Button onClick={() => navigate('/register')} size="lg" className="bg-green-600 hover:bg-green-700 text-white font-black h-16 px-10 text-xl rounded-2xl shadow-2xl shadow-green-600/20 transition-all hover:scale-105 active:scale-95">
              Começar Agora Grátis
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 font-bold h-16 px-10 text-xl rounded-2xl" onClick={() => navigate('/login')}>
              Acessar Minha Conta
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<Zap className="w-10 h-10 text-yellow-500" />}
            title="Rápido e Prático"
            description="Cadastre seus produtos e comece a vender em poucos minutos."
          />
          <FeatureCard 
            icon={<MessageCircle className="w-10 h-10 text-green-500" />}
            title="Pedidos no Zap"
            description="Os pedidos chegam organizados direto no seu WhatsApp."
          />
          <FeatureCard 
            icon={<Smartphone className="w-10 h-10 text-blue-500" />}
            title="Mobile First"
            description="Experiência perfeita para seus clientes pedirem pelo celular."
          />
          <FeatureCard 
            icon={<DollarSign className="w-10 h-10 text-emerald-500" />}
            title="Zero Taxas"
            description="Não cobramos comissão sobre suas vendas. O lucro é seu."
          />
        </div>
      </section>

      {/* Social Proof / Footer */}
      <footer className="py-10 px-4 text-center border-t border-zinc-800 bg-zinc-950">
        <p className="text-zinc-500">&copy; 2026 ZapPedidos - A solução definitiva para seu delivery.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-zinc-800 border-zinc-700 hover:border-green-500/50 transition-colors">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl text-zinc-100">{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
