import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/error-handler';
import { Product, OperationType } from '@/types';

export const productService = {
  async getProducts(storeId: string) {
    const path = `stores/${storeId}/products`;
    try {
      const snapshot = await getDocs(collection(db, path));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async createProduct(storeId: string, data: Omit<Product, 'id'>) {
    const path = `stores/${storeId}/products`;
    const productRef = doc(collection(db, path));
    const productData = {
      ...data,
      id: productRef.id,
    };
    try {
      await setDoc(productRef, productData);
      return productData;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateProduct(storeId: string, productId: string, data: Partial<Product>) {
    const path = `stores/${storeId}/products/${productId}`;
    const productRef = doc(db, path);
    try {
      await updateDoc(productRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteProduct(storeId: string, productId: string) {
    const path = `stores/${storeId}/products/${productId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
