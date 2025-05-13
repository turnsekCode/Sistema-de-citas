import { redirect } from 'next/navigation';
import { getServerSession } from '../../lib/auth';
//import AppointmentList from '../../components/AppointmentList';
import CalendarComponent from '../../components/CalendarComponent';

export default async function AppointmentsPage() {
  const session = await getServerSession();
  console.log('Session:', session);
  if (!session) {
    redirect('/login');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {/*<AppointmentList />*/} lista aqui
        </div>
        <div className="lg:col-span-2">
          <CalendarComponent />
        </div>
      </div>
    </div>
  );
}