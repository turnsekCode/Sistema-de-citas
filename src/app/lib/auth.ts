// lib/auth.ts
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import jwt from 'jsonwebtoken';
import dbConnect from './dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || '';

export async function getServerSession(cookieStore?: ReadonlyRequestCookies) {
  try {
    const token = cookieStore?.get('token')?.value;
    if (!token) return null;

    await dbConnect();
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    
    return user ? { user } : null;
  } catch (error) {
    console.error('Error in getServerSession:', error);
    return null;
  }
}