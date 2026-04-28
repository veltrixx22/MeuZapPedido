import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storeService } from '@/services/storeService';
import { categoryService } from '@/services/categoryService';
import { productService } from '@/services/productService';
import { Store, Category, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ChevronLeft, Trash2, Edit2, Package, Layers, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { ImagePicker } from '@/components/ImagePicker';

export default function ProductManagement() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    available: true
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      // In a real app we'd fetch store by ID, here we assume it's one of user's stores
      const myStores = await storeService.getMyStores();
      const currentStore = myStores?.find(s => s.id === id);
      if (!currentStore) {
        toast.error('Loja não encontrada');
        navigate('/dashboard');
        return;
      }
      setStore(currentStore);

      const cats = await categoryService.getCategories(id);
      setCategories(cats || []);

      const prods = await productService.getProducts(id);
      setProducts(prods || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName || !id) return;
    try {
      await categoryService.createCategory(id, newCategoryName, categories.length);
      toast.success('Categoria criada!');
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
      const cats = await categoryService.getCategories(id);
      setCategories(cats || []);
    } catch (error) {
      toast.error('Erro ao criar categoria');
    }
  };

  const handleSaveProduct = async () => {
    if (!id || !productForm.name || !productForm.price || !productForm.categoryId) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    try {
      const data = {
        ...productForm,
        price: parseFloat(productForm.price),
        storeId: id
      };

      if (editingProduct) {
        await productService.updateProduct(id, editingProduct.id, data);
        toast.success('Produto atualizado!');
      } else {
        await productService.createProduct(id, data);
        toast.success('Produto criado!');
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', imageUrl: '', categoryId: '', available: true });
      const prods = await productService.getProducts(id);
      setProducts(prods || []);
    } catch (error) {
      toast.error('Erro ao salvar produto');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!id || !window.confirm('Deseja excluir este produto?')) return;
    try {
      await productService.deleteProduct(id, productId);
      toast.success('Produto excluído');
      const prods = await productService.getProducts(id);
      setProducts(prods || []);
    } catch (error) {
      toast.error('Erro ao excluir');
    }
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description || '',
      price: p.price.toString(),
      imageUrl: p.imageUrl || '',
      categoryId: p.categoryId,
      available: p.available
    });
    setIsProductModalOpen(true);
  };

  if (loading) return <div className="p-10 text-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Voltar ao Painel
        </Button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{store?.name}</h1>
            <p className="text-muted-foreground">Gerencie seus produtos e categorias.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(true)}>
              <Layers className="w-4 h-4 mr-2" /> Nova Categoria
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
              setEditingProduct(null);
              setProductForm({ name: '', description: '', price: '', imageUrl: '', categoryId: categories[0]?.id || '', available: true });
              setIsProductModalOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" /> Novo Produto
            </Button>
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
          <Layers className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
          <h2 className="text-xl font-semibold">Crie categorias primeiro</h2>
          <p className="text-muted-foreground mb-6">Ex: Lanches, Bebidas, Pizzas...</p>
          <Button onClick={() => setIsCategoryModalOpen(true)}>Criar Categoria</Button>
        </div>
      ) : (
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          <TabsList className="flex flex-wrap h-auto bg-transparent p-0 gap-2 mb-8">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="bg-zinc-100 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-full px-6 py-2"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.categoryId === cat.id).map(prod => (
                  <Card key={prod.id} className="overflow-hidden flex flex-col">
                    <div className="h-40 bg-zinc-100 relative">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-zinc-300">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                      {!prod.available && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold bg-red-600 px-3 py-1 rounded">ESGOTADO</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="flex-1">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{prod.name}</CardTitle>
                        <span className="font-bold text-green-700">R$ {prod.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{prod.description}</p>
                    </CardHeader>
                    <div className="p-4 border-t flex gap-2">
                      <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEditProduct(prod)}>
                        <Edit2 className="w-4 h-4 mr-2" /> Editar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteProduct(prod.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                <button 
                  onClick={() => {
                    setEditingProduct(null);
                    setProductForm({ name: '', description: '', price: '', imageUrl: '', categoryId: cat.id, available: true });
                    setIsProductModalOpen(true);
                  }}
                  className="h-[280px] border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:border-green-500 hover:text-green-500 transition-colors"
                >
                  <Plus className="w-10 h-10 mb-2" />
                  <span className="font-medium">Adicionar nesta categoria</span>
                </button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Categories Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Nome da Categoria</Label>
              <Input id="catName" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ex: Bebidas" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleAddCategory}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
          </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <ImagePicker 
                label="Foto do Produto"
                value={productForm.imageUrl}
                onChange={(val) => setProductForm({...productForm, imageUrl: val})}
              />
              <div className="space-y-2">
                <Label htmlFor="pName">Nome</Label>
              <Input id="pName" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pDesc">Descrição</Label>
              <Input id="pDesc" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pPrice">Preço (R$)</Label>
                <Input id="pPrice" type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pCat">Categoria</Label>
                <select 
                  id="pCat" 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({...productForm, categoryId: e.target.value})}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input 
                type="checkbox" 
                id="pAvailable" 
                checked={productForm.available} 
                onChange={(e) => setProductForm({...productForm, available: e.target.checked})}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
              />
              <Label htmlFor="pAvailable">Disponível em estoque</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveProduct} className="bg-green-600 hover:bg-green-700 text-white">Salvar Produto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
