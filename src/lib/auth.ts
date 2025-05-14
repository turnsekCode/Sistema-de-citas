import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_muy_seguro';

export default async function getServerSession() {
  try {
    const cookieStore = await cookies(); // <-- OBTIENE LAS COOKIES DEL REQUEST
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    await dbConnect();
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id).select('-password');

    return user ? { user } : null;
  } catch (error) {
    console.error('Error en getServerSession:', error);
    return null;
  }
}
