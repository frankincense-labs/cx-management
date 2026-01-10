import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export async function submitFeedback(userId, email, rating, comment, category = '', attachments = []) {
  const feedbackData = {
    userId,
    email,
    rating: parseInt(rating),
    comment,
    category,
    status: 'submitted',
    attachments, // Array of { url, name, size, type }
    createdAt: new Date().toISOString(),
    reviewedAt: null,
  }

  const docRef = await addDoc(collection(db, 'feedback'), feedbackData)
  return docRef.id
}

export async function getUserFeedback(userId) {
  const q = query(
    collection(db, 'feedback'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export function subscribeToUserFeedback(userId, callback) {
  const q = query(
    collection(db, 'feedback'),
    where('userId', '==', userId)
  )

  return onSnapshot(q, (querySnapshot) => {
    const feedback = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    // Sort in memory instead of using orderBy
    feedback.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    callback(feedback)
  })
}

export async function getAllFeedback() {
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export function subscribeToAllFeedback(callback) {
  const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (querySnapshot) => {
    const feedback = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(feedback)
  })
}

export async function markFeedbackAsReviewed(feedbackId) {
  const feedbackRef = doc(db, 'feedback', feedbackId)
  await updateDoc(feedbackRef, {
    status: 'reviewed',
    reviewedAt: new Date().toISOString(),
  })
}

