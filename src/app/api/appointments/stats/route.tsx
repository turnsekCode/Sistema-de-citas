import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/models/Appointment';
import getServerSession from '@/lib/auth';
import Doctor from '@/models/Doctor';

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Estadísticas generales
    const totalAppointments = await Appointment.countDocuments();
    const todaysAppointments = await Appointment.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lte: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    // Conteo por estado
    const statusCounts = await Appointment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Convertir el array de statusCounts a un objeto
    const statusCountsObj = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Citas por mes (últimos 6 meses)
    const monthlyCounts = await Appointment.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Formatear los datos mensuales
    const formattedMonthlyCounts = monthlyCounts.reduce((acc, curr) => {
      const date = new Date();
      date.setFullYear(curr._id.year);
      date.setMonth(curr._id.month - 1);
      const monthName = date.toLocaleString('es', { month: 'long' });
      acc[`${monthName} ${curr._id.year}`] = curr.count;
      return acc;
    }, {} as Record<string, number>);

    // Conteo de doctores (necesitarás importar el modelo Doctor)
    const totalDoctors = await Doctor.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        totalAppointments,
        todaysAppointments,
        statusCounts: statusCountsObj,
        monthlyCounts: formattedMonthlyCounts,
        totalDoctors
      }
    });

  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}