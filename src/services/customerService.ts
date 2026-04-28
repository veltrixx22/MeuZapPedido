import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/error-handler';
import { CustomerProfile, OperationType } from '@/types';

const CUSTOMERS_PATH = 'customers';

export const customerService = {
  async getProfile(userId: string) {
    const profileRef = doc(db, CUSTOMERS_PATH, userId);
    try {
      const snapshot = await getDoc(profileRef);
      if (!snapshot.exists()) return null;
      return snapshot.data() as CustomerProfile;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${CUSTOMERS_PATH}/${userId}`);
      return null;
    }
  },

  async saveProfile(userId: string, data: Omit<CustomerProfile, 'id' | 'createdAt' | 'updatedAt'>) {
    const profileRef = doc(db, CUSTOMERS_PATH, userId);
    const now = serverTimestamp();
    
    try {
      const existing = await this.getProfile(userId);
      if (existing) {
        await updateDoc(profileRef, {
          ...data,
          updatedAt: now,
        });
      } else {
        await setDoc(profileRef, {
          ...data,
          id: userId,
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${CUSTOMERS_PATH}/${userId}`);
    }
  }
};
