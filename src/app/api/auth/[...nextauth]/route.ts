import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import dbConnect from '../../../lib/dbConnect';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../lib/jwt';

export async function POST(req: Request) {
  await dbConnect();
  
  const { email, password } = await req.json();
  
  try {
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    
    const token = signToken(user._id);
    
    const { password: _, ...userWithoutPass } = user.toObject();
    
    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPass,
    });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}