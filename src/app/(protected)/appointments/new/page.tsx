import { redirect } from 'next/navigation';
import getServerSession from '@/lib/auth';
import AppointmentForm from '@/components/AppointmentForm';

export default async function NewAppointmentPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nueva Cita Médica</h1>
      <AppointmentForm />
    </div>
  );
}