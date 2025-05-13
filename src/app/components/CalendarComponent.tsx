'use client';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import {format} from 'date-fns/format';
import {parse} from 'date-fns/parse';
import {startOfWeek} from 'date-fns/startOfWeek';
import {getDay} from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../src/app/contexts/AuthContext';
import { fetchAppointments } from '@/services/appointmentService';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarComponent() {
  const { user } = useAuth();
  interface Doctor {
    name: string;
  }

  interface Appointment {
    doctor: Doctor;
    reason: string;
    date: string;
  }

  interface Event {
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    resource: Appointment;
  }

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        interface Doctor {
          name: string;
        }

        interface Appointment {
          doctor: Doctor;
          reason: string;
          date: string;
        }

        interface Event {
          title: string;
          start: Date;
          end: Date;
          allDay: boolean;
          resource: Appointment;
        }

        const formattedEvents: Event[] = appointments.map((appointment: Appointment) => ({
          title: `Cita con Dr. ${appointment.doctor.name} - ${appointment.reason}`,
          start: new Date(appointment.date),
          end: new Date(new Date(appointment.date).getTime() + 30 * 60000), // 30 minutes
          allDay: false,
          resource: appointment,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadAppointments();
    }
  }, [user]);

  if (loading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="h-[600px] mt-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView="week"
        views={['month', 'week', 'day', 'agenda']}
        selectable
        onSelectEvent={event => {
          // Handle event click
          console.log(event.resource);
        }}
        onSelectSlot={slotInfo => {
          // Handle slot selection for new appointment
          console.log(slotInfo);
        }}
      />
    </div>
  );
}