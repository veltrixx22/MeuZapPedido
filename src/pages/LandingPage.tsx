import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useFirebase } from '@/lib/FirebaseProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap, MessageCircle, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const { user, loading } = useFirebase();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  if (user && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
        <h1 className="text-4xl font-bold">Bem-vindo de volta!</h1>
        <Button onClick={() => navigate('/dashboard')} size="lg">Ir para o Painel</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center bg-zinc-950 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Seu Cardápio Digital <span className="text-green-500">no WhatsApp</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Crie seu cardápio em minutos, receba pedidos direto no seu WhatsApp e aumente suas vendas sem taxas abusivas.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button onClick={handleLogin} size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 text-xl rounded-full">
              Começar Agora Grátis
            </Button>
          </div>
        </motion.div>
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
