import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '@/services/storeService';
import { Store } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Save, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { ImagePicker } from '@/components/ImagePicker';

export default function StoreManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    description: '',
    whatsapp: '',
    address: '',
    logoUrl: '',
    slug: '',
    deliveryFee: 0
  });

  useEffect(() => {
    if (id) loadStore();
  }, [id]);

  const loadStore = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const myStores = await storeService.getMyStores();
      const current = myStores?.find(s => s.id === id);
      if (current) {
        setStore(current);
        setForm({
          name: current.name,
          description: current.description || '',
          whatsapp: current.whatsapp,
          address: current.address || '',
          logoUrl: current.logoUrl || '',
          slug: current.slug,
          deliveryFee: current.deliveryFee || 0
        });
      } else {
        toast.error('Loja não encontrada');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!id || !form.name || !form.whatsapp || !form.slug) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      await storeService.updateStore(id, form);
      toast.success('Configurações salvas!');
      loadStore();
    } catch (error) {
      toast.error('Erro ao salvar');
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/dashboard')}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Voltar ao Painel
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Configurações da Loja</CardTitle>
          <CardDescription>Gerencie as informações principais do seu estabelecimento.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImagePicker 
            label="Logo da Loja"
            value={form.logoUrl}
            onChange={(val) => setForm({...form, logoUrl: val})}
          />

          <div className="space-y-2">
            <Label htmlFor="sName">Nome da Loja</Label>
            <Input id="sName" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sSlug">Link (slug)</Label>
            <Input id="sSlug" value={form.slug} onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/[^\w-]/g, '')})} />
            <p className="text-xs text-muted-foreground">URL: zappedidos.app/{form.slug}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sDesc">Descrição / Bio</Label>
            <Input id="sDesc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Pizzas artesanais e muito mais..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sZap">WhatsApp (com DDD)</Label>
            <Input id="sZap" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value.replace(/\D/g, '')})} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sAddr">Endereço</Label>
            <Input id="sAddr" value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Rua das Flores, 123..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sFee">Taxa de Entrega (R$)</Label>
            <Input id="sFee" type="number" step="0.01" value={form.deliveryFee} onChange={e => setForm({...form, deliveryFee: parseFloat(e.target.value) || 0})} />
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700 h-12" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
