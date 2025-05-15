'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAppointments, deleteAppointment } from '@/services/appointmentService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import { generateAppointmentPdf } from '@/lib/generatePdf';

interface IAppointment {
  // Define the properties of IAppointment here
  id: string;
  patientName: string;
  patientEmail: string;
}

interface AppointmentWithDetails extends IAppointment {
  _id: string; // Add the _id property
  doctor: {
    name: string;
    specialty: string;
  };
  status: string; // Add the status property
  reason: string; // Add the reason property
  date: string; // Add the date property
}

export default function AppointmentList() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  //console.log('User listado:', user);
  //console.log('Appointments listado:', appointments);
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error loading appointments:', error);
        toast.error('Error al cargar las citas');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadAppointments();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      try {
        await deleteAppointment(id);
        setAppointments(appointments.filter(app => app._id !== id));
        toast.success('Cita cancelada correctamente');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        toast.error('Error al cancelar la cita');
      }
    }
  };

  const handleExportPdf = async (appointment: AppointmentWithDetails) => {
    try {
      const pdfBytes = await generateAppointmentPdf(appointment);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cita-${appointment._id}.pdf`;
      link.click();
      toast.success('PDF generado correctamente');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Error al generar el PDF');
    }
  };

  const filteredAppointments = appointments.filter(app => {
    // Filtrar por estado
    if (filter !== 'all' && app.status !== filter) return false;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        app.doctor.name.toLowerCase().includes(term) ||
        app.doctor.specialty.toLowerCase().includes(term) ||
        app.reason.toLowerCase().includes(term) ||
        app.status.toLowerCase().includes(term)
      );
    }
    
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Mis Citas</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          
          <input
            type="text"
            placeholder="Buscar citas..."
            className="px-3 py-2 border rounded-md text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Link
            href="/appointments/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
          >
            Nueva Cita
          </Link>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p>No hay citas {filter !== 'all' ? `con estado ${filter}` : ''} {searchTerm ? `que coincidan con "${searchTerm}"` : ''}</p>
          <Link href="/doctors" className="text-blue-600 hover:underline mt-2 inline-block">
            Ver doctores disponibles
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(appointment.date), "PPPp", { locale: es })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Dr. {appointment.doctor.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.doctor.specialty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'pending' && 'Pendiente'}
                        {appointment.status === 'confirmed' && 'Confirmada'}
                        {appointment.status === 'completed' && 'Completada'}
                        {appointment.status === 'cancelled' && 'Cancelada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <Link
                        href={`/appointments/${appointment._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleExportPdf(appointment)}
                        className="text-green-600 hover:text-green-900"
                      >
                        PDF
                      </button>
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}