import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  PageContent,
  HeroSection,
  AboutSection,
  MissionVision,
  Program,
  Event,
  TeamMember,
  Partner,
  FormSubmission,
  Statistics,
  News,
  SuccessStory,
  InsertPageContent,
  InsertHeroSection,
  InsertAboutSection,
  InsertMissionVision,
  InsertProgram,
  InsertEvent,
  InsertTeamMember,
  InsertPartner,
  InsertFormSubmission,
  InsertStatistics,
  InsertNews,
  InsertSuccessStory,
} from "@shared/schema";

// Helper function to convert Firestore timestamps to dates
const convertTimestamps = (data: any): any => {
  if (!data) return data;
  
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  
  return converted;
};

// Generic CRUD operations
export class FirestoreService {
  // Get all documents from a collection
  static async getAll<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => convertTimestamps({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document by ID
  static async getById<T>(collectionName: string, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return convertTimestamps({ id: docSnap.id, ...docSnap.data() }) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Create a new document
  static async create<T>(collectionName: string, data: Omit<T, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  }

  // Update a document
  static async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async delete(collectionName: string, id: string): Promise<void> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error);
      throw error;
    }
  }

  // Subscribe to real-time updates
  static subscribe<T>(
    collectionName: string,
    callback: (data: T[]) => void,
    constraints: QueryConstraint[] = []
  ): () => void {
    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => 
        convertTimestamps({ id: doc.id, ...doc.data() }) as T
      );
      callback(data);
    });
  }
}

// Specific service functions for each entity
export const PageContentService = {
  getAll: () => FirestoreService.getAll<PageContent>('pages'),
  getBySlug: async (slug: string) => {
    const pages = await FirestoreService.getAll<PageContent>('pages', [where('slug', '==', slug)]);
    return pages[0] || null;
  },
  getById: (id: string) => FirestoreService.getById<PageContent>('pages', id),
  create: (data: InsertPageContent) => FirestoreService.create<PageContent>('pages', { ...data, lastModified: new Date() }),
  update: (id: string, data: Partial<PageContent>) => FirestoreService.update<PageContent>('pages', id, { ...data, lastModified: new Date() }),
  delete: (id: string) => FirestoreService.delete('pages', id),
  subscribe: (callback: (data: PageContent[]) => void) => FirestoreService.subscribe<PageContent>('pages', callback),
};

export const ProgramService = {
  getAll: () => FirestoreService.getAll<Program>('programs', [orderBy('createdAt', 'desc')]),
  getActive: () => FirestoreService.getAll<Program>('programs', [where('status', '==', 'Active'), orderBy('createdAt', 'desc')]),
  getById: (id: string) => FirestoreService.getById<Program>('programs', id),
  create: (data: InsertProgram) => FirestoreService.create<Program>('programs', { ...data, createdAt: new Date(), updatedAt: new Date() }),
  update: (id: string, data: Partial<Program>) => FirestoreService.update<Program>('programs', id, { ...data, updatedAt: new Date() }),
  delete: (id: string) => FirestoreService.delete('programs', id),
  subscribe: (callback: (data: Program[]) => void) => FirestoreService.subscribe<Program>('programs', callback, [orderBy('createdAt', 'desc')]),
};

export const EventService = {
  getAll: () => FirestoreService.getAll<Event>('events', [orderBy('date', 'desc')]),
  getUpcoming: () => FirestoreService.getAll<Event>('events', [where('date', '>=', new Date()), where('isPublished', '==', true), orderBy('date', 'asc')]),
  getById: (id: string) => FirestoreService.getById<Event>('events', id),
  create: (data: InsertEvent) => FirestoreService.create<Event>('events', { ...data, createdAt: new Date() }),
  update: (id: string, data: Partial<Event>) => FirestoreService.update<Event>('events', id, { ...data, createdAt: data.createdAt || new Date() }),
  delete: (id: string) => FirestoreService.delete('events', id),
  subscribe: (callback: (data: Event[]) => void) => FirestoreService.subscribe<Event>('events', callback, [orderBy('date', 'desc')]),
};

export const TeamMemberService = {
  getAll: () => FirestoreService.getAll<TeamMember>('team', [where('isActive', '==', true), orderBy('order', 'asc')]),
  getById: (id: string) => FirestoreService.getById<TeamMember>('team', id),
  create: (data: InsertTeamMember) => FirestoreService.create<TeamMember>('team', data),
  update: (id: string, data: Partial<TeamMember>) => FirestoreService.update<TeamMember>('team', id, data),
  delete: (id: string) => FirestoreService.delete('team', id),
  subscribe: (callback: (data: TeamMember[]) => void) => FirestoreService.subscribe<TeamMember>('team', callback, [where('isActive', '==', true), orderBy('order', 'asc')]),
};

export const PartnerService = {
  getAll: () => FirestoreService.getAll<Partner>('partners', [where('isActive', '==', true), orderBy('order', 'asc')]),
  getById: (id: string) => FirestoreService.getById<Partner>('partners', id),
  create: (data: InsertPartner) => FirestoreService.create<Partner>('partners', data),
  update: (id: string, data: Partial<Partner>) => FirestoreService.update<Partner>('partners', id, data),
  delete: (id: string) => FirestoreService.delete('partners', id),
  subscribe: (callback: (data: Partner[]) => void) => FirestoreService.subscribe<Partner>('partners', callback, [where('isActive', '==', true), orderBy('order', 'asc')]),
};

export const FormSubmissionService = {
  getAll: () => FirestoreService.getAll<FormSubmission>('submissions', [orderBy('submittedAt', 'desc')]),
  getByType: (type: string) => FirestoreService.getAll<FormSubmission>('submissions', [where('type', '==', type), orderBy('submittedAt', 'desc')]),
  getById: (id: string) => FirestoreService.getById<FormSubmission>('submissions', id),
  create: (data: InsertFormSubmission) => FirestoreService.create<FormSubmission>('submissions', { ...data, submittedAt: new Date() }),
  update: (id: string, data: Partial<FormSubmission>) => FirestoreService.update<FormSubmission>('submissions', id, { ...data, submittedAt: data.submittedAt || new Date() }),
  delete: (id: string) => FirestoreService.delete('submissions', id),
  subscribe: (callback: (data: FormSubmission[]) => void) => FirestoreService.subscribe<FormSubmission>('submissions', callback, [orderBy('submittedAt', 'desc')]),
};

export const StatisticsService = {
  get: async () => {
    const stats = await FirestoreService.getAll<Statistics>('statistics');
    return stats[0] || null;
  },
  update: async (data: Partial<Statistics>) => {
    const stats = await StatisticsService.get();
    if (stats) {
      await FirestoreService.update<Statistics>('statistics', stats.id, { ...data, lastUpdated: new Date() });
    } else {
      await FirestoreService.create<Statistics>('statistics', { id: 'main', lastUpdated: new Date(), ...data } as InsertStatistics);
    }
  },
  subscribe: (callback: (data: Statistics | null) => void) => {
    return FirestoreService.subscribe<Statistics>('statistics', (data) => {
      callback(data[0] || null);
    });
  },
};

export const NewsService = {
  getAll: () => FirestoreService.getAll<News>('news', [where('isPublished', '==', true), orderBy('publishDate', 'desc')]),
  getRecent: (limitCount = 5) => FirestoreService.getAll<News>('news', [where('isPublished', '==', true), orderBy('publishDate', 'desc'), limit(limitCount)]),
  getById: (id: string) => FirestoreService.getById<News>('news', id),
  create: (data: InsertNews) => FirestoreService.create<News>('news', { ...data, createdAt: new Date() }),
  update: (id: string, data: Partial<News>) => FirestoreService.update<News>('news', id, { ...data, createdAt: data.createdAt || new Date() }),
  delete: (id: string) => FirestoreService.delete('news', id),
  subscribe: (callback: (data: News[]) => void) => FirestoreService.subscribe<News>('news', callback, [where('isPublished', '==', true), orderBy('publishDate', 'desc')]),
};

export const SuccessStoryService = {
  getAll: () => FirestoreService.getAll<SuccessStory>('success-stories', [where('isPublished', '==', true), orderBy('createdAt', 'desc')]),
  getFeatured: (limitCount = 3) => FirestoreService.getAll<SuccessStory>('success-stories', [where('isPublished', '==', true), orderBy('createdAt', 'desc'), limit(limitCount)]),
  getById: (id: string) => FirestoreService.getById<SuccessStory>('success-stories', id),
  create: (data: InsertSuccessStory) => FirestoreService.create<SuccessStory>('success-stories', { ...data, createdAt: new Date() }),
  update: (id: string, data: Partial<SuccessStory>) => FirestoreService.update<SuccessStory>('success-stories', id, { ...data, createdAt: data.createdAt || new Date() }),
  delete: (id: string) => FirestoreService.delete('success-stories', id),
  subscribe: (callback: (data: SuccessStory[]) => void) => FirestoreService.subscribe<SuccessStory>('success-stories', callback, [where('isPublished', '==', true), orderBy('createdAt', 'desc')]),
};

export const HeroSectionService = {
  getAll: () => FirestoreService.getAll<HeroSection>('hero-sections', [orderBy('lastModified', 'desc')]),
  getActive: () => FirestoreService.getAll<HeroSection>('hero-sections', [where('isActive', '==', true), orderBy('lastModified', 'desc'), limit(1)]),
  getById: (id: string) => FirestoreService.getById<HeroSection>('hero-sections', id),
  create: (data: InsertHeroSection) => FirestoreService.create<HeroSection>('hero-sections', { ...data, lastModified: new Date() }),
  update: (id: string, data: Partial<HeroSection>) => FirestoreService.update<HeroSection>('hero-sections', id, { ...data, lastModified: new Date() }),
  delete: (id: string) => FirestoreService.delete('hero-sections', id),
  subscribe: (callback: (data: HeroSection[]) => void) => FirestoreService.subscribe<HeroSection>('hero-sections', callback, [orderBy('lastModified', 'desc')]),
};

export const AboutSectionService = {
  getAll: () => FirestoreService.getAll<AboutSection>('about-sections', [orderBy('lastModified', 'desc')]),
  getActive: () => FirestoreService.getAll<AboutSection>('about-sections', [where('isActive', '==', true), orderBy('lastModified', 'desc'), limit(1)]),
  getById: (id: string) => FirestoreService.getById<AboutSection>('about-sections', id),
  create: (data: InsertAboutSection) => FirestoreService.create<AboutSection>('about-sections', { ...data, lastModified: new Date() }),
  update: (id: string, data: Partial<AboutSection>) => FirestoreService.update<AboutSection>('about-sections', id, { ...data, lastModified: new Date() }),
  delete: (id: string) => FirestoreService.delete('about-sections', id),
  subscribe: (callback: (data: AboutSection[]) => void) => FirestoreService.subscribe<AboutSection>('about-sections', callback, [orderBy('lastModified', 'desc')]),
};

export const MissionVisionService = {
  getAll: () => FirestoreService.getAll<MissionVision>('mission-vision', [orderBy('lastModified', 'desc')]),
  getActive: () => FirestoreService.getAll<MissionVision>('mission-vision', [where('isActive', '==', true), orderBy('lastModified', 'desc'), limit(1)]),
  getById: (id: string) => FirestoreService.getById<MissionVision>('mission-vision', id),
  create: (data: InsertMissionVision) => FirestoreService.create<MissionVision>('mission-vision', { ...data, lastModified: new Date() }),
  update: (id: string, data: Partial<MissionVision>) => FirestoreService.update<MissionVision>('mission-vision', id, { ...data, lastModified: new Date() }),
  delete: (id: string) => FirestoreService.delete('mission-vision', id),
  subscribe: (callback: (data: MissionVision[]) => void) => FirestoreService.subscribe<MissionVision>('mission-vision', callback, [orderBy('lastModified', 'desc')]),
};
