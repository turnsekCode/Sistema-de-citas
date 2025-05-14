import  dbConnect  from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ user: null });

  try {
    const decoded: any = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
