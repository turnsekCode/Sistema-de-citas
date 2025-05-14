import { redirect } from 'next/navigation';
import getServerSession from '@/lib/auth';
import ReportsDashboard from '@/components/ReportsDashboard';

export default async function ReportsPage() {
  const session = await getServerSession();
  
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h1>
      <ReportsDashboard />
    </div>
  );
}