import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/error-handler';
import { Store, OperationType } from '@/types';

const STORES_PATH = 'stores';

export const storeService = {
  async createStore(data: Omit<Store, 'id' | 'ownerId' | 'createdAt' | 'updatedAt'>) {
    if (!auth.currentUser) throw new Error('User must be authenticated');
    
    const storeRef = doc(collection(db, STORES_PATH));
    const storeData = {
      ...data,
      id: storeRef.id,
      ownerId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(storeRef, storeData);
      return storeData;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, STORES_PATH);
    }
  },

  async updateStore(storeId: string, data: Partial<Store>) {
    const storeRef = doc(db, STORES_PATH, storeId);
    try {
      await updateDoc(storeRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${STORES_PATH}/${storeId}`);
    }
  },

  async getStoreBySlug(slug: string) {
    const q = query(collection(db, STORES_PATH), where('slug', '==', slug));
    try {
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      return snapshot.docs[0].data() as Store;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, STORES_PATH);
    }
  },

  async getMyStores() {
    if (!auth.currentUser) return [];
    const q = query(collection(db, STORES_PATH), where('ownerId', '==', auth.currentUser.uid));
    try {
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => doc.data() as Store);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, STORES_PATH);
    }
  },

  async getStoreById(id: string) {
    const storeRef = doc(db, STORES_PATH, id);
    try {
      const snapshot = await getDoc(storeRef);
      if (!snapshot.exists()) return null;
      return snapshot.data() as Store;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${STORES_PATH}/${id}`);
    }
  }
};
