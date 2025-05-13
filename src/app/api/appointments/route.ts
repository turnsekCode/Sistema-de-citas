import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';
import { getSession } from '@/lib/auth';
import { sendAppointmentEmail } from '../../lib/sendEmail';

export async function GET(req: Request) {
  await dbConnect();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    let appointments;
    
    if (session.user.role === 'admin') {
      appointments = await Appointment.find()
        .populate('patient', 'name email')
        .populate('doctor', 'name specialty');
    } else {
      appointments = await Appointment.find({ patient: session.user._id })
        .populate('doctor', 'name specialty');
    }
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { doctorId, date, reason, notes } = await req.json();
  
  try {
    const appointment = new Appointment({
      patient: session.user._id,
      doctor: doctorId,
      date,
      reason,
      notes,
      status: 'pending',
    });
    
    await appointment.save();
    
    // Send confirmation email
    await sendAppointmentEmail(session.user.email, 'Appointment Created', {
      appointmentId: appointment._id,
      date: appointment.date,
      doctor: appointment.doctor,
      reason: appointment.reason,
    });
    
    return NextResponse.json(
      { message: 'Appointment created successfully', appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  await dbConnect();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { id, ...updateData } = await req.json();
  
  try {
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    // Only allow admin or the patient who created the appointment to update it
    if (session.user.role !== 'admin' && appointment.patient.toString() !== session.user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('doctor', 'name specialty');
    
    // Send update email
    if (updatedAppointment) {
      await sendAppointmentEmail(session.user.email, 'Appointment Updated', {
        appointmentId: updatedAppointment._id,
        date: updatedAppointment.date,
        doctor: updatedAppointment.doctor,
        reason: updatedAppointment.reason,
        status: updatedAppointment.status,
      });
    }
    
    return NextResponse.json(
      { message: 'Appointment updated successfully', appointment: updatedAppointment }
    );
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  
  const { id } = await req.json();
  
  try {
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
    }
    
    // Only allow admin or the patient who created the appointment to delete it
    if (session.user.role !== 'admin' && appointment.patient.toString() !== session.user._id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    await Appointment.findByIdAndDelete(id);
    
    // Send cancellation email
    await sendAppointmentEmail(session.user.email, 'Appointment Cancelled', {
      appointmentId: appointment._id,
      date: appointment.date,
      doctor: appointment.doctor,
    });
    
    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}