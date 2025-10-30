// Optimized Firestore service with fast loading and fallbacks
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  QueryConstraint,
  query as firestoreQuery,
  serverTimestamp,
  connectFirestoreEmulator,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED
} from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';

// Fast Firebase configuration with optimizations
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project'}.firebaseapp.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app'
};

// Initialize Firebase with performance optimizations
import type { Firestore } from 'firebase/firestore';

let app;
let db: Firestore;

try {
  const existingApps = getApps();
  if (existingApps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = existingApps[0];
  }

  // Initialize Firestore with cache optimizations
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    experimentalForceLongPolling: false, // Use WebChannel for better performance
  });
} catch (error) {
  console.warn('Firebase initialization failed, using fallback:', error);
  // Create minimal app for development
  app = initializeApp({ projectId: 'demo-project' }, 'fallback');
  db = initializeFirestore(app, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  });
}

// Fast service class with immediate returns and error handling
export class FastFirestoreService {
  static timeout = 3000; // 3 second timeout for all operations

  private static async withTimeout<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timeout')), this.timeout)
      )
    ]);
  }

  static async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints.length > 0 ? firestoreQuery(collectionRef, ...constraints) : collectionRef;
      
      const querySnapshot = await this.withTimeout(getDocs(q));
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    } catch (error) {
      console.warn(`Failed to load ${collectionName}:`, error);
      return []; // Return empty array instead of throwing
    }
  }

  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await this.withTimeout(getDoc(docRef));
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      }
      return null;
    } catch (error) {
      console.warn(`Failed to load ${collectionName}/${id}:`, error);
      return null;
    }
  }

  static async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const collectionRef = collection(db, collectionName);
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await this.withTimeout(addDoc(collectionRef, docData));
      return docRef.id;
    } catch (error) {
      console.error(`Failed to create in ${collectionName}:`, error);
      throw error;
    }
  }

  static async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await this.withTimeout(updateDoc(docRef, updateData));
    } catch (error) {
      console.error(`Failed to update ${collectionName}/${id}:`, error);
      throw error;
    }
  }

  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await this.withTimeout(deleteDoc(docRef));
    } catch (error) {
      console.error(`Failed to delete ${collectionName}/${id}:`, error);
      throw error;
    }
  }
}

// Fast service implementations with immediate fallbacks
export const FastProgramService = {
  getAll: () => FastFirestoreService.getAll('programs'),
  getById: (id: string) => FastFirestoreService.getById('programs', id),
  create: (data: any) => FastFirestoreService.create('programs', data),
  update: (id: string, data: any) => FastFirestoreService.update('programs', id, data),
  delete: (id: string) => FastFirestoreService.delete('programs', id),
};

export const FastEventService = {
  getAll: () => FastFirestoreService.getAll('events'),
  getById: (id: string) => FastFirestoreService.getById('events', id),
  create: (data: any) => FastFirestoreService.create('events', data),
  update: (id: string, data: any) => FastFirestoreService.update('events', id, data),
  delete: (id: string) => FastFirestoreService.delete('events', id),
};

export const FastTeamMemberService = {
  getAll: () => FastFirestoreService.getAll('team'),
  getById: (id: string) => FastFirestoreService.getById('team', id),
  create: (data: any) => FastFirestoreService.create('team', data),
  update: (id: string, data: any) => FastFirestoreService.update('team', id, data),
  delete: (id: string) => FastFirestoreService.delete('team', id),
};

export const FastPartnerService = {
  getAll: () => FastFirestoreService.getAll('partners'),
  getById: (id: string) => FastFirestoreService.getById('partners', id),
  create: (data: any) => FastFirestoreService.create('partners', data),
  update: (id: string, data: any) => FastFirestoreService.update('partners', id, data),
  delete: (id: string) => FastFirestoreService.delete('partners', id),
};

export const FastSuccessStoryService = {
  getAll: () => FastFirestoreService.getAll('success-stories'),
  getById: (id: string) => FastFirestoreService.getById('success-stories', id),
  create: (data: any) => FastFirestoreService.create('success-stories', data),
  update: (id: string, data: any) => FastFirestoreService.update('success-stories', id, data),
  delete: (id: string) => FastFirestoreService.delete('success-stories', id),
};

export const FastNewsService = {
  getAll: () => FastFirestoreService.getAll('news'),
  getById: (id: string) => FastFirestoreService.getById('news', id),
  create: (data: any) => FastFirestoreService.create('news', data),
  update: (id: string, data: any) => FastFirestoreService.update('news', id, data),
  delete: (id: string) => FastFirestoreService.delete('news', id),
};

export const FastPageContentService = {
  getAll: () => FastFirestoreService.getAll('pages'),
  getById: (id: string) => FastFirestoreService.getById('pages', id),
  create: (data: any) => FastFirestoreService.create('pages', data),
  update: (id: string, data: any) => FastFirestoreService.update('pages', id, data),
  delete: (id: string) => FastFirestoreService.delete('pages', id),
};

export const FastStatisticsService = {
  get: async () => {
    try {
      const data = await FastFirestoreService.getById('statistics', 'main');
      return data || {};
    } catch (error) {
      return {};
    }
  },
  update: (data: any) => FastFirestoreService.update('statistics', 'main', data),
};

export const FastUnSdgService = {
  getAll: () => FastFirestoreService.getAll('un-sdgs'),
  getById: (id: string) => FastFirestoreService.getById('un-sdgs', id),
  create: (data: any) => FastFirestoreService.create('un-sdgs', data),
  update: (id: string, data: any) => FastFirestoreService.update('un-sdgs', id, data),
  delete: (id: string) => FastFirestoreService.delete('un-sdgs', id),
};

export default db;