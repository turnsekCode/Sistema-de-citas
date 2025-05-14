import { redirect } from 'next/navigation';
import getServerSession from '@/lib/auth';
import DoctorList from '@/components/DoctorList';

export default async function DoctorsPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nuestros Doctores</h1>
      <DoctorList />
    </div>
  );
}