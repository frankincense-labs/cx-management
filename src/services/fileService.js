import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function validateFile(file) {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File "${file.name}" exceeds the maximum size of 5MB. Current size: ${formatFileSize(file.size)}`)
  }

  // Allowed file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type not allowed for "${file.name}". Please upload images (JPG, PNG, GIF, WEBP) or PDF files.`)
  }

  return true
}

export async function uploadFile(file, folder = 'uploads') {
  // Validate file
  validateFile(file)

  // Create unique filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const fileExtension = file.name.split('.').pop()
  const fileName = `${timestamp}_${randomString}.${fileExtension}`

  // Create storage reference
  const storageRef = ref(storage, `${folder}/${fileName}`)

  // Upload file
  await uploadBytes(storageRef, file)

  // Get download URL
  const downloadURL = await getDownloadURL(storageRef)

  return {
    url: downloadURL,
    name: file.name,
    size: file.size,
    type: file.type,
  }
}

export async function uploadMultipleFiles(files, folder = 'uploads') {
  const uploadPromises = files.map((file) => uploadFile(file, folder))
  return Promise.all(uploadPromises)
}

