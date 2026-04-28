import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/error-handler';
import { Category, OperationType } from '@/types';

export const categoryService = {
  async getCategories(storeId: string) {
    const path = `stores/${storeId}/categories`;
    const q = query(collection(db, path), orderBy('order', 'asc'));
    try {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  },

  async createCategory(storeId: string, name: string, order: number = 0) {
    const path = `stores/${storeId}/categories`;
    const categoryRef = doc(collection(db, path));
    const data = {
      id: categoryRef.id,
      name,
      storeId,
      order
    };
    try {
      await setDoc(categoryRef, data);
      return data;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  },

  async updateCategory(storeId: string, categoryId: string, data: Partial<Category>) {
    const path = `stores/${storeId}/categories/${categoryId}`;
    const categoryRef = doc(db, path);
    try {
      await updateDoc(categoryRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  async deleteCategory(storeId: string, categoryId: string) {
    const path = `stores/${storeId}/categories/${categoryId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }
};
