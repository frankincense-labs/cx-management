import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../config/firebase'

function generateTicketId() {
  return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`
}

export async function createTicket(userId, email, subject, description, priority = 'medium', attachments = []) {
  const ticketData = {
    ticketId: generateTicketId(),
    userId,
    email,
    subject,
    description,
    priority,
    status: 'open',
    attachments, // Array of { url, name, size, type }
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
  }

  const docRef = await addDoc(collection(db, 'tickets'), ticketData)
  return { id: docRef.id, ticketId: ticketData.ticketId }
}

export async function getUserTickets(userId) {
  const q = query(
    collection(db, 'tickets'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export function subscribeToUserTickets(userId, callback) {
  const q = query(
    collection(db, 'tickets'),
    where('userId', '==', userId)
  )

  return onSnapshot(q, (querySnapshot) => {
    const tickets = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    // Sort in memory instead of using orderBy
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    callback(tickets)
  })
}

export async function getAllTickets() {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export function subscribeToAllTickets(callback) {
  const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))

  return onSnapshot(q, (querySnapshot) => {
    const tickets = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(tickets)
  })
}

export async function getTicketById(ticketId) {
  const q = query(collection(db, 'tickets'), where('ticketId', '==', ticketId))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    // Try by document ID instead
    const docRef = doc(db, 'tickets', ticketId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  }

  const ticketDoc = querySnapshot.docs[0]
  return { id: ticketDoc.id, ...ticketDoc.data() }
}

export async function updateTicketStatus(ticketId, status) {
  const ticketRef = doc(db, 'tickets', ticketId)
  const updateData = {
    status,
    updatedAt: new Date().toISOString(),
  }

  if (status === 'resolved') {
    updateData.resolvedAt = new Date().toISOString()
  }

  await updateDoc(ticketRef, updateData)
}

export async function addTicketReply(ticketId, adminId, adminEmail, message) {
  const replyData = {
    ticketId,
    adminId,
    adminEmail,
    message,
    createdAt: new Date().toISOString(),
  }

  const docRef = await addDoc(collection(db, 'ticketReplies'), replyData)
  return docRef.id
}

export async function getTicketReplies(ticketId) {
  const q = query(
    collection(db, 'ticketReplies'),
    where('ticketId', '==', ticketId),
    orderBy('createdAt', 'asc')
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}

export function subscribeToTicketReplies(ticketId, callback) {
  const q = query(
    collection(db, 'ticketReplies'),
    where('ticketId', '==', ticketId),
    orderBy('createdAt', 'asc')
  )

  return onSnapshot(q, (querySnapshot) => {
    const replies = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    callback(replies)
  })
}

