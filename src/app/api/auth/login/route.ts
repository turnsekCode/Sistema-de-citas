import { signToken } from '@/lib/jwt';
import connectDB from '@/lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await connectDB();
  
  const { email, password } = await req.json();
console.log('Email from client:', email);
console.log('Password from client:', password);

  
  // Verifica si el usuario existe
  const user = await User.findOne({ email });
  console.log('Password from client:', password);
  console.log('Hashed password from DB:', user?.password);
  
  // Si el usuario no existe o no se puede comparar la contraseña
  if (!user) {
    console.log('User not found');
    return NextResponse.json({ message: 'Invalid credentials 2' }, { status: 401 });
  }
  
  console.log('User found:', user);
  
  // Verifica la contraseña
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  console.log('Password match:', isPasswordCorrect);
  
  if (!isPasswordCorrect) {
    return NextResponse.json({ message: 'Invalid credentials 2' }, { status: 401 });
  }
  
  // Generar el token
  const token = signToken({ id: user._id, role: user.role });
  
  const res = NextResponse.json({ user });
  res.cookies.set('token', token, { httpOnly: true });
  return res;
}
