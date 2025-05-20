import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import IDoctor from '@/models/Doctor';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    console.log('Fetching doctor with ID:', params.id);
  try {
    await dbConnect();
    const appointment = await IDoctor.findById(params.id)
    
    if (!appointment) {
      return NextResponse.json({ message: 'Doctor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}