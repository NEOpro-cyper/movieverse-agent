import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'movieverse-secret-key'

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

// Compare password
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

// Register user
export async function registerUser(email, password, name) {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new Error('Email already registered')
  }

  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    }
  })

  const token = generateToken(user.id)
  return { user, token }
}

// Login user
export async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isValid = await comparePassword(password, user.password)
  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  const token = generateToken(user.id)
  return { user, token }
}

// Get user from token
export async function getUserFromToken(token) {
  const decoded = verifyToken(token)
  if (!decoded) return null

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      photo: true,
      banner: true,
      description: true,
      xp: true,
      moviesWatched: true,
      episodesWatched: true,
      commentsCount: true,
      threadsCreated: true,
      theme: true,
      notifyEnabled: true,
      createdAt: true,
    }
  })

  return user
}

// Update user profile
export async function updateUserProfile(userId, data) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      photo: true,
      banner: true,
      description: true,
      xp: true,
      moviesWatched: true,
      episodesWatched: true,
      commentsCount: true,
      threadsCreated: true,
      theme: true,
      notifyEnabled: true,
    }
  })
}
