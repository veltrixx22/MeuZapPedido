import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/error-handler';
import { Order, OperationType, OrderStatus } from '@/types';

export const orderService = {
  async createOrder(storeId: string, data: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber' | 'status'>) {
    const path = `stores/${storeId}/orders`;
    const orderRef = doc(collection(db, path));
    
    // Generate a simple order number based on current orders count (not accurate for high concurrency but good for demo)
    // In production we would use a counter document
    const ordersSnapshot = await getDocs(collection(db, path));
    const nextOrderNumber = ordersSnapshot.size + 1;

    const orderData = {
      ...data,
      id: orderRef.id,
      storeId,
      status: 'Novo' as OrderStatus,
      orderNumber: nextOrderNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(orderRef, orderData);
      return orderData;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  listenToOrders(storeId: string, callback: (orders: Order[]) => void) {
    const path = `stores/${storeId}/orders`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => doc.data() as Order);
      callback(orders);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });
  },

  async updateOrderStatus(storeId: string, orderId: string, status: OrderStatus) {
    const path = `stores/${storeId}/orders/${orderId}`;
    const orderRef = doc(db, path);
    try {
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }
};
