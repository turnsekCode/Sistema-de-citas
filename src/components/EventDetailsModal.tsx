"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { deleteAppointment } from "@/services/appointmentService";
import { toast } from "react-toastify";
import { useState } from "react";

interface EventDetailsModalProps {
    event: {
        title: string;
        start: Date;
        end: Date;
        resource: {
            id: string;
            doctor: {
                name: string;
                specialty: string;
            };
            reason: string;
            notes?: string;
            status: string;
        };
    };
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function EventDetailsModal({
    event,
    onClose,
    onEdit,
    onDelete,
}: EventDetailsModalProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (
            !window.confirm("¿Estás seguro de que deseas eliminar esta cita?")
        ) {
            return;
        }

        setLoading(true);
        try {
            await deleteAppointment(event.resource.id);
            toast.success("Cita eliminada correctamente");
            onDelete();
        } catch (error) {
            console.error("Error deleting appointment:", error);
            toast.error("Error al eliminar la cita");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = () => {
        switch (event.resource.status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = () => {
        switch (event.resource.status) {
            case "pending":
                return "Pendiente";
            case "confirmed":
                return "Confirmada";
            case "completed":
                return "Completada";
            case "cancelled":
                return "Cancelada";
            default:
                return event.resource.status;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Detalles de la Cita
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium">
                                {event.title}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Fecha</p>
                                <p>
                                    {format(event.start, "PPP", { locale: es })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Hora</p>
                                <p>
                                    {format(event.start, "p", { locale: es })} -{" "}
                                    {format(event.end, "p", { locale: es })}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Doctor</p>
                            <p>
                                Dr. {event.resource.doctor.name} (
                                {event.resource.doctor.specialty})
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Motivo</p>
                            <p>{event.resource.reason}</p>
                        </div>

                        {event.resource.notes && (
                            <div>
                                <p className="text-sm text-gray-500">Notas</p>
                                <p className="whitespace-pre-line">
                                    {event.resource.notes}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500">Estado</p>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}
                            >
                                {getStatusText()}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? "Eliminando..." : "Eliminar"}
                        </button>
                        <button
                            onClick={onEdit}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
