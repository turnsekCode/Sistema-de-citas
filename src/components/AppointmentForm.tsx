'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchDoctors } from '@/services/doctorService';
import { createAppointment, updateAppointment } from '@/services/appointmentService';
import { useAuth } from '@/contexts/AuthContext';

interface AppointmentFormProps {
  appointment?: {
    _id: string;
    doctor: {
      _id: string;
      name: string;
    };
    date: string;
    reason: string;
    notes?: string;
    status: string;
  };
}

export default function AppointmentForm({ appointment }: AppointmentFormProps) {
    console.log('AppointmentForm base', appointment);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

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
    
    if (appointment) {
      reset({
        doctorId: appointment.doctor._id,
        date: new Date(appointment.date).toISOString().slice(0, 16),
        reason: appointment.reason,
        notes: appointment.notes || '',
      });
    }
  }, [appointment, reset]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(appointment._id, data);
        toast.success('Cita actualizada correctamente');
      } else {
        await createAppointment(data);
        toast.success('Cita creada correctamente');
      }
      router.push('/appointments');
    } catch (error: any) {
      console.error('Error saving appointment:', error);
      toast.error(error.message || 'Error al guardar la cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <select
            {...register('doctorId', { required: 'Selecciona un doctor' })}
            className={`w-full p-2 border rounded-md ${errors.doctorId ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          >
            <option value="">Selecciona un doctor</option>
            {doctors.map((doctor: any) => (
              <option key={doctor._id} value={doctor._id}>
                Dr. {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="mt-1 text-sm text-red-600">{errors.doctorId.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
          <input
            type="datetime-local"
            {...register('date', { required: 'Selecciona una fecha y hora' })}
            className={`w-full p-2 border rounded-md ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo de la consulta</label>
          <input
            type="text"
            {...register('reason', { required: 'Describe el motivo de la cita' })}
            className={`w-full p-2 border rounded-md ${errors.reason ? 'border-red-500' : 'border-gray-300'}`}
            disabled={loading}
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/appointments')}
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
            {loading ? 'Guardando...' : appointment ? 'Actualizar Cita' : 'Crear Cita'}
          </button>
        </div>
      </form>
    </div>
  );
}