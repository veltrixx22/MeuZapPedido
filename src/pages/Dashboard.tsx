import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storeService } from '@/services/storeService';
import { Store } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Store as StoreIcon, ExternalLink, Settings, LayoutGrid, LogOut, ShoppingBag } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';

export default function Dashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreSlug, setNewStoreSlug] = useState('');
  const [newStoreWhatsapp, setNewStoreWhatsapp] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const myStores = await storeService.getMyStores();
      setStores(myStores || []);
    } catch (error) {
      console.error('Error fetching stores:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleCreateStore = async () => {
    if (!newStoreName || !newStoreSlug || !newStoreWhatsapp) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Check if slug is available
      const existing = await storeService.getStoreBySlug(newStoreSlug);
      if (existing) {
        toast.error('Este link já está em uso, escolha outro.');
        return;
      }

      await storeService.createStore({
        name: newStoreName,
        slug: newStoreSlug.toLowerCase().replace(/\s+/g, '-'),
        whatsapp: newStoreWhatsapp,
      });
      
      toast.success('Loja criada com sucesso!');
      setIsDialogOpen(false);
      fetchStores();
    } catch (error) {
      console.error('Error creating store:', error);
      toast.error('Erro ao criar loja');
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Cardápios</h1>
          <p className="text-muted-foreground">Gerencie suas lojas e produtos.</p>
        </div>
        <div className="flex gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger
              render={
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" /> Nova Loja
                </Button>
              }
            />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Loja</DialogTitle>
                <DialogDescription>
                  Defina o nome e o link público da sua loja.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Loja</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Pizzaria do João" 
                    value={newStoreName}
                    onChange={(e) => {
                      setNewStoreName(e.target.value);
                      // Auto-suggestion for slug
                      if (!newStoreSlug) setNewStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''));
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Link da Loja (slug)</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">zappedidos.com.br/</span>
                    <Input 
                      id="slug" 
                      placeholder="pizzaria-joao" 
                      value={newStoreSlug}
                      onChange={(e) => setNewStoreSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                  <Input 
                    id="whatsapp" 
                    placeholder="5511999999999" 
                    value={newStoreWhatsapp}
                    onChange={(e) => setNewStoreWhatsapp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreateStore} className="bg-green-600 hover:bg-green-700">Criar Loja</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-zinc-100 animate-pulse rounded-xl" />)}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
          <StoreIcon className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
          <h2 className="text-xl font-semibold">Você ainda não tem lojas</h2>
          <p className="text-muted-foreground mb-6">Crie sua primeira loja para começar a vender.</p>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" /> Criar Minha Loja
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(store => (
            <Card key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-zinc-950 text-white p-6">
                <CardTitle>{store.name}</CardTitle>
                <CardDescription className="text-zinc-400">zappedidos.app/{store.slug}</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="font-medium mr-2">WhatsApp:</span> {store.whatsapp}
                </div>
              </CardContent>
              <CardFooter className="bg-zinc-50 border-t p-4 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => window.open(`/${store.slug}`, '_blank')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Ver Menu
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/dashboard/orders/${store.id}`)}>
                  <ShoppingBag className="w-4 h-4 mr-2 text-blue-600" /> Pedidos
                </Button>
              </CardFooter>
              <CardFooter className="bg-zinc-50 border-t-0 p-4 pt-0 flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/dashboard/products/${store.id}`)}>
                  <LayoutGrid className="w-4 h-4 mr-2" /> Editar Itens
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigate(`/dashboard/store/${store.id}`)}>
                  <Settings className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
