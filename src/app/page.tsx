import Link from 'next/link';
//import { getServerSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
 // const session = await getServerSession();
  
 

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <h1 className="text-4xl font-bold text-center mb-8">Sistema de Citas Médicas</h1>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </Link>
        <Link
          href="/register"
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}