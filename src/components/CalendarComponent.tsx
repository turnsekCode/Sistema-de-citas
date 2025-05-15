'use client';

import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMinutes } from 'date-fns';
import { es as esES } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchAppointments } from '@/services/appointmentService';
import AppointmentModal from '@/components/AppointmentModal';
import EventDetailsModal from '@/components/EventDetailsModal';
import { toast } from 'react-toastify';

const locales = {
  es: esES,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

interface Appointment {
  id: string;
  doctor: Doctor;
  reason: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Appointment;
}

export default function EnhancedCalendar() {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{start: Date, end: Date} | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);
console.log("slot", selectedSlot);
    console.log("event", selectedEvent);
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const appointments = await fetchAppointments();
        
        const formattedEvents = appointments.map((appt: Appointment) => ({
          title: `Dr. ${appt.doctor.name} - ${appt.reason}`,
          start: new Date(appt.date),
          end: addMinutes(new Date(appt.date), 30),
          allDay: false,
          resource: appt,
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        toast.error('Error al cargar las citas');
        console.error('Error loading appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadAppointments();
  }, [user]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedSlot({
      start: slotInfo.start,
      end: slotInfo.end
    });
    setShowAppointmentModal(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3174ad';
    if (event.resource.status === 'cancelled') backgroundColor = '#d93651';
    if (event.resource.status === 'completed') backgroundColor = '#4caf50';
    if (event.resource.status === 'pending') backgroundColor = '#ff9800';

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const moveEvent = async ({ event, start, end }: { event: CalendarEvent, start: Date, end: Date }) => {
    try {
      // Aquí iría tu llamada API para actualizar la cita
      // await updateAppointment(event.resource.id, { date: start });
      
      setEvents(prev => {
        const existing = prev.find(e => e.resource.id === event.resource.id);
        const filtered = prev.filter(e => e.resource.id !== event.resource.id);
        if (existing) {
          return [...filtered, { ...existing, start, end }];
        }
        return filtered;
      });
      
      toast.success('Cita actualizada');
    } catch (error) {
      toast.error('Error al mover la cita');
      console.error('Error moving event:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px] mt-4 relative">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        defaultView={view}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        selectable
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onNavigate={setCurrentDate}
        onView={(view) => setView(view)}
        date={currentDate}
        eventPropGetter={eventStyleGetter}
        culture="es"
        //onEventDrop={moveEvent}
        //onEventResize={moveEvent}
        //draggableAccessor={() => true}
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay citas en este rango.',
        }}
      />

      {/* Modal para nueva cita */}
      {showAppointmentModal && selectedSlot && (
        <AppointmentModal
          startTime={selectedSlot.start}
          endTime={selectedSlot.end}
          onClose={() => setShowAppointmentModal(false)}
          //onSave={(appointmentData) => {
          //  // Aquí iría tu lógica para guardar la nueva cita
          //  setShowAppointmentModal(false);
          //  toast.success('Cita creada correctamente');
          //}}
        />
      )}

      {/* Modal de detalles de cita */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={() => {
            // Lógica para editar
            setSelectedEvent(null);
          }}
          onDelete={async () => {
            try {
              // Aquí iría tu llamada API para eliminar la cita
              // await deleteAppointment(selectedEvent.resource.id);
              setEvents(prev => prev.filter(e => e.resource.id !== selectedEvent.resource.id));
              setSelectedEvent(null);
              toast.success('Cita eliminada');
            } catch (error) {
              toast.error('Error al eliminar la cita');
              console.error('Error deleting appointment:', error);
            }
          }}
        />
      )}
    </div>
  );
}