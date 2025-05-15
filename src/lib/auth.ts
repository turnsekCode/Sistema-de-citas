// lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export default async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    await dbConnect();
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    return { user };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}