'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../app/contexts/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user || pathname.startsWith('/auth')) return null;

  return (
    <div className="w-64 bg-white shadow-sm h-full p-4">
      <div className="space-y-1">
        {user.role === 'admin' && (
          <>
            <Link
              href="/admin"
              className={`block px-4 py-2 rounded ${pathname === '/admin' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/users"
              className={`block px-4 py-2 rounded ${pathname.startsWith('/admin/users') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              Usuarios
            </Link>
          </>
        )}
        <Link
          href="/appointments"
          className={`block px-4 py-2 rounded ${pathname.startsWith('/appointments') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          Mis Citas
        </Link>
        <Link
          href="/calendar"
          className={`block px-4 py-2 rounded ${pathname === '/calendar' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          Calendario
        </Link>
        <Link
          href="/doctors"
          className={`block px-4 py-2 rounded ${pathname === '/doctors' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          Doctores
        </Link>
        <Link
          href="/profile"
          className={`block px-4 py-2 rounded ${pathname === '/profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
        >
          Perfil
        </Link>
      </div>
    </div>
  );
}