'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { fetchDoctors } from '@/services/doctorService';
import { createAppointment, updateAppointment } from '@/services/appointmentService';

interface Appointment {
  _id: string;
  doctor: { _id: string; name: string; specialty: string };
  date: string;
  reason: string;
  notes?: string;
}

interface AppointmentFormProps {
  appointment?: Appointment;
  onSuccess: () => void;
}

export default function AppointmentForm({ appointment, onSuccess }: AppointmentFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ doctorId: string; date: string; reason: string; notes?: string }>();
  const [doctors, setDoctors] = useState<{ _id: string; name: string; specialty: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const doctorsData = await fetchDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error loading doctors:', error);
        toast.error('Failed to load doctors');
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

  const onSubmit = async (data: { doctorId: string; date: string; reason: string; notes?: string }) => {
    setLoading(true);
    try {
      if (appointment) {
        await updateAppointment(appointment._id, data);
        toast.success('Appointment updated successfully');
      } else {
        await createAppointment(data);
        toast.success('Appointment created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error(/*error.message ||*/ 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Doctor</label>
        <select
          {...register('doctorId', { required: 'Doctor is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={loading}
        >
          <option value="">Select a doctor</option>
          {doctors.map(doctor => (
            <option key={doctor._id} value={doctor._id}>
              Dr. {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
        {errors.doctorId && <p className="mt-1 text-sm text-red-600">{errors.doctorId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date and Time</label>
        <input
          type="datetime-local"
          {...register('date', { required: 'Date and time are required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={loading}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Reason</label>
        <input
          type="text"
          {...register('reason', { required: 'Reason is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={loading}
        />
        {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes (Optional)</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Saving...' : appointment ? 'Update Appointment' : 'Create Appointment'}
        </button>
      </div>
    </form>
  );
}