import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '@/services/orderService';
import { storeService } from '@/services/storeService';
import { Order, OrderStatus, Store } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Package, 
  ExternalLink, 
  Phone, 
  MapPin,
  RefreshCcw,
  MessageCircle
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

export default function Orders() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    // Load store info
    const loadStore = async () => {
      const s = await storeService.getStoreById(storeId);
      setStore(s);
    };
    loadStore();

    // Set up real-time listener for orders
    const unsubscribe = orderService.listenToOrders(storeId, (updatedOrders) => {
      setOrders(updatedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [storeId]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (!storeId) return;
    try {
      await orderService.updateOrderStatus(storeId, orderId, newStatus);
      toast.success(`Pedido atualizado para ${newStatus}`);
    } catch (error) {
      toast.error('Erro ao atualizar pedido.');
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Novo':
        return <Badge className="bg-blue-500 hover:bg-blue-600 animate-pulse">Novo</Badge>;
      case 'Em preparo':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Em preparo</Badge>;
      case 'Finalizado':
        return <Badge className="bg-green-600 hover:bg-green-700">Finalizado</Badge>;
      case 'Cancelado':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const openWhatsApp = (phone: string, order: Order) => {
    const message = `Olá ${order.customerName}, o status do seu pedido #${order.orderNumber} foi atualizado para: *${order.status}*`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  if (loading) return <div className="p-20 text-center">Carregando pedidos...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="mb-2">
              <ChevronLeft className="w-4 h-4 mr-1" /> Voltar ao Painel
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Gerenciar Pedidos</h1>
            <p className="text-zinc-500">{store?.name} &bull; {orders.length} pedidos encontrados</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCcw className="w-4 h-4 mr-2" /> Atualizar
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <Card key={order.id} className={`overflow-hidden border-2 ${order.status === 'Novo' ? 'border-blue-500 shadow-blue-100 shadow-lg' : 'border-zinc-100'}`}>
              <CardHeader className="bg-zinc-50 border-b p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">#{order.orderNumber}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">
                    {new Date(order.createdAt?.seconds * 1000).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <User className="w-4 h-4 text-zinc-400" /> {order.customerName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <MapPin className="w-4 h-4" /> {order.customerAddress}
                  </div>
                </div>

                <div className="bg-zinc-50 rounded-lg p-3 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="text-zinc-400 font-mono">R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-green-700">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Alterar Status</span>
                    <Select defaultValue={order.status} onValueChange={(val) => handleStatusUpdate(order.id, val as OrderStatus)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Mudar status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Novo">Novo</SelectItem>
                        <SelectItem value="Em preparo">Em preparo</SelectItem>
                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 text-xs px-2"
                      onClick={() => order.customerPhone && openWhatsApp(order.customerPhone, order)}
                    >
                      <MessageCircle className="w-3 h-3 mr-1 text-green-500" /> Avisar Cliente
                    </Button>
                    {order.customerPhone && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`tel:${order.customerPhone}`}><Phone className="w-4 h-4" /></a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {orders.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Package className="w-16 h-16 text-zinc-200 mx-auto" />
              <div className="space-y-1">
                <p className="text-xl font-bold text-zinc-400">Nenhum pedido ainda</p>
                <p className="text-zinc-500 text-sm">Os pedidos dos clientes aparecerão aqui em tempo real.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function User({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
