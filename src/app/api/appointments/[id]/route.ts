import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const appointment = await Appointment.findById(params.id)
      .populate('doctor', 'name specialty')
      .populate('patient', 'name email');
    
    if (!appointment) {
      return NextResponse.json({ message: 'Cita no encontrada' }, { status: 404 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}