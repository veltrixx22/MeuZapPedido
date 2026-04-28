import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { storeService } from '@/services/storeService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { Store, Category, Product, CartItem, Order, CustomerProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Plus, Minus, X, MessageCircle, Info, MapPin, CheckCircle2, ChevronLeft, Send, Phone, User, DollarSign, Truck, LogIn, Mail, Lock, LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

type MenuView = 'menu' | 'checkout' | 'auth' | 'success';

export default function MenuPage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [view, setView] = useState<MenuView>('menu');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  // Auth form state
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authLoading, setAuthLoading] = useState(false);

  // Form state
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'Pix',
    notes: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // If logged in, try to fetch profile
        fetchCustomerProfile(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCustomerProfile = async (uid: string) => {
    const profile = await customerService.getProfile(uid);
    if (profile) {
      setCustomerData(prev => ({
        ...prev,
        name: profile.name || prev.name,
        phone: profile.phone || prev.phone,
        address: profile.address || prev.address
      }));
    }
  };

  useEffect(() => {
    if (slug) loadData();
  }, [slug]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, provider);
      setView('checkout');
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao entrar com Google');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!authEmail || !authPassword) {
      toast.error('Preencha os campos de email e senha');
      return;
    }
    setAuthLoading(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      } else {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
      }
      setView('checkout');
      toast.success(authMode === 'login' ? 'Bem-vindo de volta!' : 'Conta criada com sucesso!');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Email ou senha incorretos');
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('Este email já está em uso');
      } else {
        toast.error('Erro na autenticação');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const loadData = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const s = await storeService.getStoreBySlug(slug);
      if (!s) {
        setLoading(false);
        return;
      }
      setStore(s);

      const [cats, prods] = await Promise.all([
        categoryService.getCategories(s.id),
        productService.getProducts(s.id)
      ]);

      setCategories(cats || []);
      setProducts(prods || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = store?.deliveryFee || 0;
  const finalTotal = total + deliveryFee;

  const handleFinalizeOrder = async () => {
    if (!store) return;
    
    // Validations
    if (cart.length === 0) {
      toast.error('Seu carrinho está vazio.');
      return;
    }
    if (!customerData.name) {
      toast.error('Informe seu nome para continuar.');
      return;
    }
    if (!customerData.phone) {
      toast.error('Informe seu WhatsApp para continuar.');
      return;
    }
    if (!customerData.address) {
      toast.error('Informe o endereço de entrega.');
      return;
    }
    if (!store.whatsapp) {
      toast.error('O WhatsApp da loja não foi configurado.');
      return;
    }

    setIsSubmitting(true);
    toast.info('Preparando pedido...');

    try {
      // Save customer profile if logged in
      if (currentUser) {
        await customerService.saveProfile(currentUser.uid, {
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          email: currentUser.email || ''
        });
      }

      // Save order to Firestore
      const orderData = await orderService.createOrder(store.id, {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        customerId: currentUser?.uid,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: finalTotal,
        paymentMethod: customerData.paymentMethod as any,
        notes: customerData.notes
      } as any);

      // Format WhatsApp Message
      let message = `*Novo Pedido - ${store.name}*\n\n`;
      message += `*Cliente:* ${customerData.name}\n`;
      message += `*WhatsApp:* ${customerData.phone}\n`;
      message += `*Endereço:* ${customerData.address}\n\n`;
      
      message += `*Itens:*\n`;
      cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
      });
      
      if (deliveryFee > 0) {
        message += `\n*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
      }
      
      message += `\n*Total:* R$ ${finalTotal.toFixed(2).replace('.', ',')}\n`;
      message += `\n*Forma de pagamento:* ${customerData.paymentMethod}\n`;
      
      if (customerData.notes) {
        message += `*Observação:* ${customerData.notes}\n`;
      }
      
      const encodedMessage = encodeURIComponent(message);
      
      // Clean and format phone number
      let cleanPhone = store.whatsapp.replace(/\D/g, '');
      if (!cleanPhone.startsWith('55') && cleanPhone.length <= 11) {
        cleanPhone = '55' + cleanPhone;
      }
      
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
      
      // Open WhatsApp
      window.open(waUrl, '_blank');
      
      // Reset flow
      setCart([]);
      setCustomerData({ name: '', phone: '', address: '', paymentMethod: 'Pix', notes: '' });
      setView('menu');
      toast.success('Pedido enviado para o WhatsApp!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao gerar link do WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Carregando cardápio...</div>;
  if (!store) return <div className="p-20 text-center font-bold text-xl">Loja não encontrada.</div>;

  return (
    <div className="dark min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      {/* Header */}
      <header className="px-6 py-10 md:px-12 bg-card/30 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {store.logoUrl ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img src={store.logoUrl} alt={store.name} className="w-28 h-28 rounded-3xl object-cover ring-4 ring-white/5 shadow-2xl" />
              <div className="absolute -bottom-2 -right-2 bg-primary rounded-xl p-2 shadow-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ) : (
            <div className="w-28 h-28 rounded-3xl bg-primary flex items-center justify-center text-4xl font-black text-white shadow-2xl">
              {store.name.charAt(0)}
            </div>
          )}
          <div className="text-center md:text-left space-y-3 flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight drop-shadow-sm">{store.name}</h1>
              <Badge className="w-fit mx-auto md:mx-0 bg-green-500/10 text-green-400 border-green-500/20 py-1 px-3">Aberto</Badge>
            </div>
            <CardDescription className="text-muted-foreground text-lg max-w-2xl">{store.description}</CardDescription>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm pt-2">
              {store.address && (
                <div className="flex items-center text-zinc-400 hover:text-zinc-200 transition-colors">
                  <MapPin className="w-4 h-4 mr-2 text-primary" /> {store.address}
                </div>
              )}
              <div className="flex items-center text-zinc-400">
                <DollarSign className="w-4 h-4 mr-2 text-primary" /> 
                {store.deliveryFee && store.deliveryFee > 0 
                  ? `Entrega: R$ ${store.deliveryFee.toFixed(2).replace('.', ',')}` 
                  : 'Entrega Grátis'}
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col items-end gap-2">
             <div className="flex items-center gap-4 mb-2">
               {currentUser ? (
                 <div className="flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-4 py-1 border border-white/5">
                   {currentUser.photoURL && <img src={currentUser.photoURL} alt="" className="w-6 h-6 rounded-full" />}
                   <span className="text-xs font-bold text-zinc-300">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                   <Button variant="ghost" size="icon" onClick={() => auth.signOut()} className="w-6 h-6 text-zinc-500 hover:text-red-500 rounded-full">
                     <LogOut className="w-3 h-3" />
                   </Button>
                 </div>
               ) : (
                 <Button variant="link" onClick={() => setView('auth')} className="text-zinc-400 text-xs p-0 h-auto">
                   Entrar ou Cadastrar
                 </Button>
               )}
               <div className="flex items-center gap-2 text-zinc-500 text-sm border-l border-white/5 pl-4">
                  <Info className="w-4 h-4" />
                  <span>Pedido mínimo R$ 20,00</span>
               </div>
             </div>
             <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
                <MessageCircle className="w-4 h-4 mr-2" /> Falar com Atendente
             </Button>
          </div>
        </div>
      </header>

      {view === 'menu' ? (
        <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-16">
          {/* Categories Horizontal Scroll */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-zinc-400 uppercase text-sm tracking-widest">Categorias</h2>
              <Button variant="link" className="text-primary p-0 h-auto font-bold">Ver Tudo</Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <div className="flex gap-4">
                <button className="flex flex-col items-center gap-3 group">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-all group-hover:scale-110">
                    <span className="text-white text-2xl">🔥</span>
                  </div>
                  <span className="text-sm font-bold text-white">Populares</span>
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    className="flex flex-col items-center gap-3 group shrink-0"
                    onClick={() => {
                      const el = document.getElementById(`cat-${cat.id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <div className="w-16 h-16 rounded-full bg-card border border-white/5 flex items-center justify-center shadow-lg transition-all group-hover:border-primary/50 group-hover:scale-110">
                      <span className="text-zinc-400 group-hover:text-primary transition-colors text-xs font-bold uppercase">{cat.name.slice(0, 2)}</span>
                    </div>
                    <span className="text-sm font-medium text-zinc-500 group-hover:text-zinc-200 transition-colors">{cat.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </section>

          {categories.map(cat => (
            <section key={cat.id} id={`cat-${cat.id}`} className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black">{cat.name}</h2>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.filter(p => p.categoryId === cat.id).map(prod => (
                  <motion.div
                    key={prod.id}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <Card className="bg-card border-white/5 overflow-hidden shadow-xl hover:shadow-primary/5 transition-all h-full flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {prod.imageUrl ? (
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        ) : (
                          <div className="w-full h-full bg-secondary flex items-center justify-center">
                            <span className="text-4xl">🍴</span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                           <Badge className="bg-black/40 backdrop-blur-md border-none text-white flex items-center gap-1">
                              ⭐ 4.8
                           </Badge>
                        </div>
                      </div>
                      
                      <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4 text-center">
                        <div className="space-y-2">
                          <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">{prod.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{prod.description}</p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-3">
                          <span className="font-black text-2xl text-white">R$ {prod.price.toFixed(2).replace('.', ',')}</span>
                          
                          {prod.available ? (
                            <Button 
                              onClick={() => addToCart(prod)} 
                              className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 font-bold shadow-lg shadow-primary/20"
                            >
                              Adicionar
                            </Button>
                          ) : (
                            <Badge variant="outline" className="w-full py-2 justify-center text-muted-foreground border-white/10 bg-white/5">Esgotado</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </main>
      ) : view === 'auth' ? (
        <main className="max-w-xl mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Card className="bg-card border-white/5 p-8 shadow-2xl rounded-3xl">
              <CardHeader className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-2">
                   <LogIn className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-black">
                  {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                </CardTitle>
                <CardDescription>
                  Identifique-se para salvar seus dados e acompanhar seus pedidos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <Button 
                  onClick={handleGoogleLogin} 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl border-white/5 bg-secondary/30 hover:bg-secondary/50 font-bold flex gap-3"
                  disabled={authLoading}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                  Continuar com Google
                </Button>

                <div className="flex items-center gap-4 text-zinc-500 text-xs font-bold uppercase tracking-widest px-2">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span>ou com email</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-400 ml-1 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Label>
                    <Input 
                      type="email"
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      className="bg-secondary/30 border-white/5 h-12 rounded-xl focus:ring-primary/50"
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-400 ml-1 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Senha
                    </Label>
                    <Input 
                      type="password"
                      value={authPassword}
                      onChange={e => setAuthPassword(e.target.value)}
                      className="bg-secondary/30 border-white/5 h-12 rounded-xl focus:ring-primary/50"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    onClick={handleEmailAuth}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20"
                    disabled={authLoading}
                  >
                    {authLoading ? 'Processando...' : (authMode === 'login' ? 'Entrar Agora' : 'Criar minha conta')}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="justify-center border-t border-white/5 pt-6 mt-4">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-primary hover:underline font-bold text-sm"
                >
                  {authMode === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
                </button>
              </CardFooter>
            </Card>
            <Button 
              variant="ghost" 
              onClick={() => setView('menu')}
              className="mt-6 text-zinc-500 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" /> Continuar como Visitante
            </Button>
          </motion.div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
          <Button 
            variant="ghost" 
            onClick={() => setView('menu')} 
            className="text-zinc-400 hover:text-white hover:bg-white/5 transition-all mb-4 px-0"
          >
            <ChevronLeft className="w-5 h-5 mr-1" /> Voltar ao Cardápio
          </Button>

          <div className="space-y-8">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tight">Checkout</h2>
              <p className="text-muted-foreground text-lg">Confirme seus dados para entrega imediata.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
              <Card className="lg:col-span-2 bg-card border-white/5 p-8 space-y-10 shadow-2xl rounded-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="cName" className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                       <User className="w-4 h-4 text-primary" /> Seu Nome
                    </Label>
                    <Input 
                      id="cName" 
                      className="bg-secondary/30 border-white/5 h-14 text-white rounded-2xl focus:ring-primary/50"
                      placeholder="Como devemos lhe chamar?" 
                      value={customerData.name}
                      onChange={e => setCustomerData({...customerData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="cPhone" className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                       <Phone className="w-4 h-4 text-primary" /> WhatsApp
                    </Label>
                    <Input 
                      id="cPhone" 
                      className="bg-secondary/30 border-white/5 h-14 text-white rounded-2xl focus:ring-primary/50"
                      placeholder="DDD + Número" 
                      value={customerData.phone}
                      onChange={e => setCustomerData({...customerData, phone: e.target.value.replace(/\D/g, '')})}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="cAddr" className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-primary" /> Endereço Completo
                  </Label>
                  <textarea 
                    id="cAddr" 
                    className="flex min-h-[120px] w-full rounded-2xl border border-white/5 bg-secondary/30 px-5 py-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Rua, número, bairro e referência de entrega..."
                    value={customerData.address}
                    onChange={e => setCustomerData({...customerData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3 relative">
                    <Label htmlFor="cPay" className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-primary" /> Pagamento
                    </Label>
                    <select 
                      id="cPay" 
                      className="w-full h-14 rounded-2xl border border-white/5 bg-secondary/30 px-5 py-2 text-sm text-white focus:ring-2 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                      value={customerData.paymentMethod}
                      onChange={e => setCustomerData({...customerData, paymentMethod: e.target.value})}
                    >
                      <option className="bg-zinc-900" value="Pix">Pix</option>
                      <option className="bg-zinc-900" value="Cartão de Crédito">Cartão de Crédito</option>
                      <option className="bg-zinc-900" value="Cartão de Débito">Cartão de Débito</option>
                      <option className="bg-zinc-900" value="Dinheiro">Dinheiro</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="cObs" className="text-zinc-300 font-bold ml-1 flex items-center gap-2">
                       <Info className="w-4 h-4 text-primary" /> Observações
                    </Label>
                    <Input 
                      id="cObs" 
                      className="bg-secondary/30 border-white/5 h-14 text-white rounded-2xl focus:ring-primary/50"
                      placeholder="Ex: sem cebola..." 
                      value={customerData.notes}
                      onChange={e => setCustomerData({...customerData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-white/5 p-8 space-y-8 shadow-2xl rounded-3xl sticky top-32 border-t border-primary/20">
                <h3 className="font-bold text-2xl flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-primary" /> Resumo
                </h3>
                
                <ScrollArea className="max-h-[300px]">
                  <div className="space-y-5 pr-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-base gap-4">
                        <span className="text-zinc-400 font-medium">{item.quantity}x {item.name}</span>
                        <span className="font-bold text-zinc-100">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between text-base text-zinc-500 font-medium">
                    <span>Subtotal</span>
                    <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-base text-zinc-500 font-medium">
                      <span>Entrega</span>
                      <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-3xl pt-2">
                    <span>Total</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white font-black text-xl rounded-2xl shadow-xl shadow-primary/20 group transition-all"
                    onClick={handleFinalizeOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : (
                      <>Finalizar <Send className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" /> </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-primary/5 rounded-2xl p-4 flex items-center gap-3 border border-primary/10">
                   <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-primary" />
                   </div>
                   <p className="text-[10px] text-zinc-500 leading-tight">
                     Ao finalizar, você será redirecionado para o WhatsApp da loja para concluir o pagamento e rastrear.
                   </p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      )}

      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && view === 'menu' && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 inset-x-6 z-50 flex justify-center"
          >
            <Button 
              size="lg" 
              onClick={() => setIsCartOpen(true)}
              className="w-full max-w-lg bg-primary hover:bg-primary/90 text-white h-16 rounded-[2rem] shadow-2xl shadow-primary/30 flex justify-between px-10 font-black text-xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl w-10 h-10 flex items-center justify-center text-sm">
                  {cart.reduce((acc, i) => acc + i.quantity, 0)}
                </div>
                <span>Ver Pedido</span>
              </div>
              <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer-like UI */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-card w-full max-w-md h-full flex flex-col shadow-2xl border-l border-white/5"
            >
              <div className="p-8 flex justify-between items-center bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black">Meu Carrinho</h2>
                  <p className="text-zinc-500 text-sm">Confira seus itens antes de pedir.</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="rounded-full hover:bg-white/5">
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <ScrollArea className="flex-1 px-8">
                <div className="space-y-8 py-8">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto">
                        <ShoppingCart className="w-10 h-10 text-zinc-600" />
                      </div>
                      <p className="text-zinc-500 text-lg font-medium">Sua sacola está vazia.</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-4 items-center group">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-2xl object-cover" />
                        )}
                        <div className="flex-1">
                          <h4 className="font-bold text-lg leading-tight line-clamp-1">{item.name}</h4>
                          <p className="text-primary font-black">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-secondary/50 rounded-2xl p-1 px-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-black text-lg w-4 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-xl hover:bg-primary/20 hover:text-primary transition-colors" 
                            onClick={() => addToCart(item)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {cart.length > 0 && (
                <div className="p-8 bg-background/50 backdrop-blur-xl border-t border-white/10 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-zinc-500 font-medium">
                      <span>Subtotal</span>
                      <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <div className="flex justify-between items-center text-zinc-500 font-medium">
                        <span>Taxa de Entrega</span>
                        <span>R$ {deliveryFee.toFixed(2).replace('.', ',')}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-3xl font-black pt-4 border-t border-white/5">
                      <span>Total</span>
                      <span className="text-primary">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex items-center gap-4">
                     <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shrink-0">
                        <Truck className="w-6 h-6 text-white" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-white leading-tight">Entrega Rápida</p>
                        <p className="text-xs text-primary font-medium">Previsão: 30-45 min</p>
                     </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white h-16 rounded-3xl font-black text-xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    onClick={() => {
                      setIsCartOpen(false);
                      if (currentUser) {
                        setView('checkout');
                      } else {
                        setView('auth');
                      }
                    }}
                  >
                    Confirmar Pedido <Send className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>

  );
}


