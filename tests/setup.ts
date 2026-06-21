import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Firebase
jest.mock('../src/lib/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firebase Auth functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((_auth, callback) => {
    // Call callback synchronously with null user to simulate no logged-in user
    // This ensures the loading state resolves immediately in tests
    callback(null);
    // Return unsubscribe function
    return jest.fn();
  }),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  signInWithPopup: jest.fn(),
}));

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn().mockResolvedValue(undefined),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  addDoc: jest.fn().mockResolvedValue({ id: 'mock-doc-id' }),
}));