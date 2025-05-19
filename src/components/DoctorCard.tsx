'use client';

import { IDoctor } from '@/models/Doctor';
import Link from 'next/link';

interface DoctorCardProps {
  doctor: IDoctor;
}

export default function DoctorCard({ doctor }: DoctorCardProps) {
    console.log("doctor info",doctor);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">Dr. {doctor.name}</h3>
        <p className="text-blue-600 mt-1">{doctor.specialty}</p>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Información de Contacto:</h4>
          <p className="text-gray-600">Email: {doctor.contactInfo.email}</p>
          <p className="text-gray-600">Teléfono: {doctor.contactInfo.phone}</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-700">Horario:</h4>
          <ul className="mt-1 space-y-1">
            {doctor.schedule.map((sched, index) => (
              <li key={index} className="text-gray-600">
                {sched.day}: {sched.startTime} - {sched.endTime}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <Link
            href={`/appointments/new?doctorId=${doctor._id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Agendar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}