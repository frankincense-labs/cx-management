import { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userDisplayName, setUserDisplayName] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, displayName = '', adminCode = '') {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Use provided name or fallback to email username
    const name = displayName || user.email.split('@')[0]

    // Check admin code (for prototype, use a simple code - in production, use environment variable)
    // Default admin code: "ADMIN2026" (change this to your preferred code)
    const ADMIN_CODE = 'ADMIN2026'
    const role = adminCode.trim() === ADMIN_CODE ? 'admin' : 'customer'

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role,
      displayName: name,
      createdAt: new Date().toISOString(),
    })

    // Update local state immediately for redirect
    setUserRole(role)
    setUserDisplayName(name)

    return userCredential
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    
    // Add additional scopes if needed
    provider.addScope('profile')
    provider.addScope('email')
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'select_account'
    })

    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user document exists, create if not
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        // Google sign-up always creates customer accounts (admin accounts require email/password for security)
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          role: 'customer', // Always customer for Google sign-up
          displayName: user.displayName || user.email.split('@')[0],
          createdAt: new Date().toISOString(),
        })

        // Update local state immediately for redirect
        setUserRole('customer')
        setUserDisplayName(user.displayName || user.email.split('@')[0])
      }

      return result
    } catch (error) {
      // Handle popup blocked error
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by your browser. Please allow popups for this site and try again.')
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in popup was closed. Please try again.')
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Another sign-in attempt is already in progress. Please wait.')
      }
      throw error
    }
  }

  function logout() {
    return signOut(auth)
  }

  async function deleteAccount(password) {
    if (!currentUser) {
      throw new Error('No user logged in')
    }

    try {
      // Re-authenticate user (required by Firebase for account deletion)
      if (!password && currentUser.providerData[0]?.providerId === 'password') {
        throw new Error('Password required for account deletion')
      }

      // Re-authenticate user (required by Firebase for account deletion)
      const providerId = currentUser.providerData[0]?.providerId
      
      if (providerId === 'password') {
        // Email/password users need to provide password
        if (!password) {
          throw new Error('Password required for account deletion')
        }
        const credential = EmailAuthProvider.credential(currentUser.email, password)
        await reauthenticateWithCredential(currentUser, credential)
      } else if (providerId === 'google.com') {
        // Google users re-authenticate via popup
        const provider = new GoogleAuthProvider()
        await reauthenticateWithPopup(currentUser, provider)
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', currentUser.uid))
      
      // Delete user from Firebase Authentication
      await deleteUser(currentUser)
      
      // Sign out (will clear local state)
      await signOut(auth)
      
      return true
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        // Set defaults immediately for fast redirect
        setUserRole('customer')
        setUserDisplayName(user.email.split('@')[0])
        setLoading(false) // Allow redirect immediately
        
        // Fetch role in background (non-blocking)
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserRole(userData.role)
            setUserDisplayName(userData.displayName || user.email.split('@')[0])
          } else {
            // If user document doesn't exist, create it with default role
            const defaultName = user.email.split('@')[0]
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: 'customer',
              displayName: defaultName,
              createdAt: new Date().toISOString(),
            })
            setUserRole('customer')
            setUserDisplayName(defaultName)
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          // Keep defaults set above
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
        setUserDisplayName(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userRole,
    userDisplayName,
    signup,
    login,
    loginWithGoogle,
    logout,
    deleteAccount,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

