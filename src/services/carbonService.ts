import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { CarbonFootprint, EcoAction, CalculatorInputs } from '../types';
import { calculateCarbonFootprint } from '../utils/helpers';

export class CarbonService {
  static async saveFootprint(userId: string, inputs: CalculatorInputs): Promise<string> {
    const footprint = calculateCarbonFootprint(inputs);
    const docRef = await addDoc(collection(db, 'carbonFootprints'), {
      ...footprint,
      userId,
      date: new Date(),
    });
    return docRef.id;
  }

  static async getLatestFootprint(userId: string): Promise<CarbonFootprint | null> {
    const q = query(
      collection(db, 'carbonFootprints'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...data,
      date: data.date.toDate(),
    } as CarbonFootprint;
  }

  static async getFootprints(userId: string, limitCount: number = 12): Promise<CarbonFootprint[]> {
    const q = query(
      collection(db, 'carbonFootprints'),
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as CarbonFootprint[];
  }

  static async saveAction(
    userId: string,
    action: Omit<EcoAction, 'id' | 'userId'>
  ): Promise<string> {
    const docRef = await addDoc(collection(db, 'ecoActions'), {
      ...action,
      userId,
      date: new Date(),
    });
    return docRef.id;
  }

  static async getActions(userId: string): Promise<EcoAction[]> {
    const q = query(
      collection(db, 'ecoActions'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as EcoAction[];
  }

  static async deleteAction(actionId: string): Promise<void> {
    await deleteDoc(doc(db, 'ecoActions', actionId));
  }
}
