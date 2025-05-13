import { IAppointment } from '@/models/Appointment';

export async function fetchAppointments() {
  const res = await fetch('/api/appointments');
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}

export async function createAppointment(data: any) {
  const res = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create appointment');
  }
  return await res.json();
}

export async function updateAppointment(id: string, data: any) {
  const res = await fetch('/api/appointments', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update appointment');
  }
  return await res.json();
}

export async function deleteAppointment(id: string) {
  const res = await fetch('/api/appointments', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete appointment');
  }
  return await res.json();
}

export async function fetchAppointmentStats() {
  const res = await fetch('/api/appointments/stats');
  if (!res.ok) throw new Error('Failed to fetch appointment stats');
  return await res.json();
}