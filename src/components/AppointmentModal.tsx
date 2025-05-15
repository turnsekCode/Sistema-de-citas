'use client';

import { useState, useEffect } from 'react';
import { fetchDoctors } from '@/services/doctorService';
import { createAppointment, updateAppointment } from '@/services/appointmentService';
import { toast } from 'react-toastify';

interface AppointmentModalProps {
  startTime: Date;
  endTime: Date;
  event?: {
    id: string;
    doctor: {
      id: string;
      name: string;
      specialty: string;
    };
    reason: string;
    notes?: string;
    status: string;
  };
  onClose: () => void;
  //onSave: () => void;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

export default function AppointmentModal({ 
  startTime, 
  endTime, 
  event, 
  onClose, 
  //onSave 
}: AppointmentModalProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: event?.doctor.id || '',
    reason: event?.reason || '',
    notes: event?.notes || '',
    date: startTime,
    status: event?.status || 'pending'
  });

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error loading doctors:', error);
        toast.error('Error al cargar los doctores');
      }
    };

    loadDoctors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (event) {
        // Editar cita existente
        await updateAppointment(event.id, {
          ...formData,
          date: formData.date.toISOString()
        });
        toast.success('Cita actualizada correctamente');
      } else {
        // Crear nueva cita
        await createAppointment({
          ...formData,
          date: formData.date.toISOString()
        });
        toast.success('Cita creada correctamente');
      }
      //onSave();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('Error al guardar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {event ? 'Editar Cita' : 'Nueva Cita'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="">Seleccionar doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    date: new Date(e.target.value)
                  }))}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.date.toTimeString().substring(0, 5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(formData.date);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    setFormData(prev => ({ ...prev, date: newDate }));
                  }}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas (Opcional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              />
            </div>

            {event && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : event ? 'Actualizar' : 'Crear Cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}