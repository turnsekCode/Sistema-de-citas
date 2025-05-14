'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith('/auth')) return null;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Citas Médicas
        </Link>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="hover:text-blue-600">
                  Admin
                </Link>
              )}
              <Link href="/appointments" className="hover:text-blue-600">
                Citas
              </Link>
              <Link href="/doctors" className="hover:text-blue-600">
                Doctores
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="hover:text-blue-600">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}