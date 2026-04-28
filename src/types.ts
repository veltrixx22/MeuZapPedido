export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  whatsapp: string;
  ownerId: string;
  address?: string;
  logoUrl?: string;
  deliveryFee?: number;
  slug: string;
  createdAt: any;
  updatedAt: any;
}

export interface Category {
  id: string;
  name: string;
  storeId: string;
  order?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  storeId: string;
  available: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  createdAt: any;
  updatedAt: any;
}

export type OrderStatus = 'Novo' | 'Em preparo' | 'Finalizado' | 'Cancelado';

export interface Order {
  id: string;
  storeId: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  customerAddress?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  orderNumber: number;
  createdAt: any;
  updatedAt: any;
}
