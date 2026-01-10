import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNfLTj1hIh-shVzrf51u_WBM4F7Q2u6GY",
  authDomain: "cx-management-add3c.firebaseapp.com",
  projectId: "cx-management-add3c",
  storageBucket: "cx-management-add3c.firebasestorage.app",
  messagingSenderId: "342684388950",
  appId: "1:342684388950:web:da82929ea8a7a3625735f7",
  measurementId: "G-KLVDRQ8EEW"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
