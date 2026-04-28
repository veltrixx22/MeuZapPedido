import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useFirebase } from '@/lib/FirebaseProvider';
import { getAuthErrorMessage } from '@/lib/auth-error';
import { storeService } from '@/services/storeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, Store, Phone, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !storeName || !whatsapp || !email || !password) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // 2. Set Display Name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // 3. Create initial store (Optional but good for onboarding)
      const slug = storeName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      // Check if slug is already taken (simple check)
      const existing = await storeService.getStoreBySlug(slug);
      const finalSlug = existing ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;

      await storeService.createStore({
        name: storeName,
        slug: finalSlug,
        whatsapp: whatsapp.replace(/\D/g, ''),
        description: `Bem-vindo à ${storeName}! Confira nossos produtos abaixo.`,
      });

      toast.success('Conta e loja criadas com sucesso!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code) {
        toast.error(getAuthErrorMessage(error));
      } else if (String(error?.message || error).includes('permission-denied')) {
        toast.error('Conta criada, mas nao foi possivel criar a loja. Publique as regras atualizadas do Firestore.');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl overflow-hidden">
          <div className="h-2 bg-green-600" />
          <CardHeader className="space-y-1 text-center pb-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Comece Grátis</CardTitle>
            <CardDescription className="text-zinc-400">
              Crie sua conta e seu primeiro cardápio em menos de 2 minutos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Seu Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="name" 
                    placeholder="João Silva" 
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeName">Nome da Loja</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="storeName" 
                    placeholder="Pizzaria do João" 
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="whatsapp" 
                    placeholder="5511999999999" 
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="joao@email.com" 
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="password">Criar Senha (mín. 6 carecteres)</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="md:col-span-2 bg-green-600 hover:bg-green-700 text-white font-bold h-12 text-lg"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Criar Minha Conta Grátis
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900 px-2 text-zinc-500">Ou use sua conta social</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-zinc-700 bg-zinc-800 hover:bg-zinc-700 hover:text-white h-12"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="mr-2 h-5 w-5" />
              Cadastrar com Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-center gap-2 border-t border-zinc-800 pt-6">
            <span className="text-sm text-zinc-400">Já tem uma conta?</span>
            <Link to="/login" className="text-sm font-bold text-green-500 hover:text-green-400 transition-colors">
              Fazer Login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
