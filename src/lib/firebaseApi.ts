import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, db } from './firebase';

// Types
export interface Service {
  id?: string;
  title: string;
  slug?: string;
  description: string;
  icon?: string;
  features?: string[];
  benefits?: string[];
  pricing?: string;
  duration?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  createdAt?: Date;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  order: number;
  createdAt?: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating?: number;
  image?: string;
  createdAt?: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success';
  createdAt?: Date;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  consultationType: string;
  preferredDate: string;
  preferredTime: string;
  description: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt?: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt?: Date;
}

// Helper pour convertir Timestamp Firestore en Date
const convertTimestamp = (data: any) => {
  if (data?.createdAt instanceof Timestamp) {
    return { ...data, createdAt: data.createdAt.toDate() };
  }
  return data;
};

// ============= AUTHENTICATION =============

export const signIn = async (email: string, password: string) => {
  try {
    console.log('FirebaseAPI: Tentative de connexion avec Firebase Auth');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('FirebaseAPI: Connexion Firebase réussie, UID:', user.uid);
    
    // Tous les utilisateurs dans Firebase Auth sont considérés comme admins
    const result = {
      user: {
        id: user.uid,
        email: user.email!,
        name: user.displayName || 'Administrateur',
        role: 'admin'
      },
      token: await user.getIdToken()
    };
    console.log('FirebaseAPI: Retour du résultat:', result);
    return result;
  } catch (error) {
    console.error('FirebaseAPI: Erreur de connexion:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
    throw new Error(errorMessage);
  }
};

export const signOut = () => firebaseSignOut(auth);

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getAdminProfile = async (userId: string): Promise<AdminUser> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) {
    throw new Error('Utilisateur non trouvé');
  }
  return { id: userDoc.id, ...userDoc.data() } as AdminUser;
};

// ============= SERVICES =============

// Services
export const getServices = async () => {
  const servicesRef = collection(db, 'services');
  const q = query(servicesRef, orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getServiceBySlug = async (slug: string) => {
  const servicesRef = collection(db, 'services');
  const q = query(servicesRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

export const addService = async (service: any) => {
  const servicesRef = collection(db, 'services');
  const docRef = await addDoc(servicesRef, {
    ...service,
    createdAt: Timestamp.now()
  });
  return docRef.id;
};

export const updateService = async (id: string, service: any) => {
  const serviceRef = doc(db, 'services', id);
  await updateDoc(serviceRef, {
    ...service,
    updatedAt: Timestamp.now()
  });
};

export const deleteService = async (id: string) => {
  const serviceRef = doc(db, 'services', id);
  await deleteDoc(serviceRef);
};

// ============= TEAM =============

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const querySnapshot = await getDocs(collection(db, 'team'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as TeamMember));
};

export const addTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  const docRef = await addDoc(collection(db, 'team'), {
    ...member,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as TeamMember;
};

export const updateTeamMember = async (id: string, member: Partial<TeamMember>): Promise<void> => {
  await updateDoc(doc(db, 'team', id), member);
};

export const deleteTeamMember = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'team', id));
};

// ============= PROCESS =============

export const getProcessSteps = async (): Promise<ProcessStep[]> => {
  const q = query(collection(db, 'process'), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as ProcessStep));
};

export const addProcessStep = async (step: Omit<ProcessStep, 'id'>): Promise<ProcessStep> => {
  const docRef = await addDoc(collection(db, 'process'), {
    ...step,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as ProcessStep;
};

export const updateProcessStep = async (id: string, step: Partial<ProcessStep>): Promise<void> => {
  await updateDoc(doc(db, 'process', id), step);
};

export const deleteProcessStep = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'process', id));
};

// ============= TESTIMONIALS =============

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const querySnapshot = await getDocs(collection(db, 'testimonials'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Testimonial));
};

export const addTestimonial = async (testimonial: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
  const docRef = await addDoc(collection(db, 'testimonials'), {
    ...testimonial,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Testimonial;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<void> => {
  await updateDoc(doc(db, 'testimonials', id), testimonial);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'testimonials', id));
};

// ============= ANNOUNCEMENTS =============

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const querySnapshot = await getDocs(collection(db, 'announcements'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Announcement));
};

export const addAnnouncement = async (announcement: Omit<Announcement, 'id'>): Promise<Announcement> => {
  const docRef = await addDoc(collection(db, 'announcements'), {
    ...announcement,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Announcement;
};

export const updateAnnouncement = async (id: string, announcement: Partial<Announcement>): Promise<void> => {
  await updateDoc(doc(db, 'announcements', id), announcement);
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'announcements', id));
};

// ============= MESSAGES =============

export const getMessages = async (): Promise<Message[]> => {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Message));
};

export const addMessage = async (message: Omit<Message, 'id'>): Promise<Message> => {
  const docRef = await addDoc(collection(db, 'messages'), {
    ...message,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Message;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'messages', id));
};

// ============= CONSULTATIONS =============

export const getConsultations = async (): Promise<Consultation[]> => {
  const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Consultation));
};

export const addConsultation = async (consultation: Omit<Consultation, 'id' | 'status'>): Promise<Consultation> => {
  const docRef = await addDoc(collection(db, 'consultations'), {
    ...consultation,
    status: 'pending',
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Consultation;
};

export const updateConsultation = async (id: string, consultation: Partial<Consultation>): Promise<void> => {
  await updateDoc(doc(db, 'consultations', id), consultation);
};

export const deleteConsultation = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'consultations', id));
};

// ============= SETTINGS =============

export interface BusinessHours {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export const getBusinessHours = async (): Promise<BusinessHours> => {
  const docRef = doc(db, 'settings', 'business_hours');
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as BusinessHours;
  }
  
  // Valeurs par défaut
  return {
    weekdays: '08:00 - 18:00',
    saturday: '09:00 - 13:00',
    sunday: 'Fermé'
  };
};

export const updateBusinessHours = async (hours: BusinessHours): Promise<void> => {
  await updateDoc(doc(db, 'settings', 'business_hours'), hours);
};

// ============= CASES (Dossiers) =============

export interface Case {
  id: string;
  title: string;
  client: string;
  caseType: string;
  status: 'pending' | 'active' | 'closed' | 'won' | 'lost';
  description?: string;
  startDate?: string;
  endDate?: string;
  assignedTo?: string;
  createdAt?: Date;
}

export const getCases = async (): Promise<Case[]> => {
  const q = query(collection(db, 'cases'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Case));
};

export const addCase = async (caseData: Omit<Case, 'id'>): Promise<Case> => {
  const docRef = await addDoc(collection(db, 'cases'), {
    ...caseData,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Case;
};

export const updateCase = async (id: string, caseData: Partial<Case>): Promise<void> => {
  await updateDoc(doc(db, 'cases', id), caseData);
};

export const deleteCase = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'cases', id));
};

// ============= APPOINTMENTS (Rendez-vous) =============

export interface Appointment {
  id: string;
  title: string;
  client: string;
  email?: string;
  phone?: string;
  appointmentType: string;
  date: string;
  time: string;
  duration?: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  assignedTo?: string;
  createdAt?: Date;
}

export const getAppointments = async (): Promise<Appointment[]> => {
  const q = query(collection(db, 'appointments'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Appointment));
};

export const addAppointment = async (appointment: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const docRef = await addDoc(collection(db, 'appointments'), {
    ...appointment,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Appointment;
};

export const updateAppointment = async (id: string, appointment: Partial<Appointment>): Promise<void> => {
  await updateDoc(doc(db, 'appointments', id), appointment);
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'appointments', id));
};

// ============= NOTIFICATIONS =============

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  isArchived?: boolean;
  userId?: string;
  link?: string;
  createdAt?: Date;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data())
  } as Notification));
};

export const addNotification = async (notification: Omit<Notification, 'id'>): Promise<Notification> => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    ...notification,
    isRead: false,
    createdAt: Timestamp.now()
  });
  const newDoc = await getDoc(docRef);
  return { id: newDoc.id, ...convertTimestamp(newDoc.data()) } as Notification;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), { isRead: true });
};

export const markNotificationAsUnread = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), { isRead: false });
};

export const archiveNotification = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', id), { isArchived: true });
};

export const deleteNotification = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'notifications', id));
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  const notifications = await getNotifications();
  const unreadNotifications = notifications.filter(n => !n.isRead);
  
  await Promise.all(
    unreadNotifications.map(n => markNotificationAsRead(n.id))
  );
};
