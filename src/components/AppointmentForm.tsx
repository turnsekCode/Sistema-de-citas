"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { fetchDoctors } from "@/services/doctorService";
import {
    createAppointment,
    updateAppointment,
    fetchAppointmentById,
} from "@/services/appointmentService";
import { useAuth } from "@/contexts/AuthContext";

interface AppointmentFormData {
    doctorId: string;
    date: string;
    reason: string;
    notes?: string;
}

interface Doctor {
    _id: string;
    name: string;
    specialty: string;
}

export default function AppointmentForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("id");
    const isEditMode = !!appointmentId;
    console.log("Modo edición:", searchParams);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AppointmentFormData>();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Cargar datos iniciales
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);

                // Cargar doctores
                const doctorsData = await fetchDoctors();
                setDoctors(doctorsData);

                // Si es modo edición, cargar la cita existente
                if (isEditMode && appointmentId) {
                    const existingAppointment =
                        await fetchAppointmentById(appointmentId);
                    console.log("Cita existente:", existingAppointment);
                    if (existingAppointment) {
                        reset({
                            doctorId: existingAppointment.doctor._id,
                            date: new Date(existingAppointment.date)
                                .toISOString()
                                .slice(0, 16),
                            reason: existingAppointment.reason,
                            notes: existingAppointment.notes || "",
                        });
                    }
                } else {
                    // Valores por defecto para nueva cita
                    reset({
                        doctorId: doctorsData[0]?._id || "",
                        date: new Date().toISOString().slice(0, 16),
                        reason: "",
                        notes: "",
                    });
                }
            } catch (error) {
                console.error("Error loading initial data:", error);
                toast.error("Error al cargar los datos iniciales");
                router.push("/appointments");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadInitialData();
        }
    }, [user, appointmentId, isEditMode, reset, router]);

    const onSubmit = async (data: AppointmentFormData) => {
        setLoading(true);
        try {
            if (isEditMode && appointmentId) {
                await updateAppointment(appointmentId, data);
                toast.success("Cita actualizada correctamente");
            } else {
                await createAppointment({
                    ...data,
                    patientId: user?._id, // Asegúrate de incluir el ID del paciente
                });
                toast.success("Cita creada correctamente");
            }
            router.push("/appointments");
        } catch (error: any) {
            console.error("Error saving appointment:", error);
            toast.error(error.message || "Error al guardar la cita");
        } finally {
            setLoading(false);
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
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">
                {isEditMode ? "Editar Cita Médica" : "Nueva Cita Médica"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Doctor
                    </label>
                    <select
                        {...register("doctorId", {
                            required: "Selecciona un doctor",
                        })}
                        className={`w-full p-2 border rounded-md ${errors.doctorId ? "border-red-500" : "border-gray-300"}`}
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
                        <p className="mt-1 text-sm text-red-600">
                            {errors.doctorId.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha y Hora
                    </label>
                    <input
                        type="datetime-local"
                        {...register("date", {
                            required: "Selecciona una fecha y hora",
                        })}
                        className={`w-full p-2 border rounded-md ${errors.date ? "border-red-500" : "border-gray-300"}`}
                        disabled={loading}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.date.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Motivo de la consulta
                    </label>
                    <input
                        type="text"
                        {...register("reason", {
                            required: "Describe el motivo de la cita",
                        })}
                        className={`w-full p-2 border rounded-md ${errors.reason ? "border-red-500" : "border-gray-300"}`}
                        disabled={loading}
                    />
                    {errors.reason && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.reason.message as string}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas adicionales (opcional)
                    </label>
                    <textarea
                        {...register("notes")}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        disabled={loading}
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.push("/appointments")}
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
                        {loading
                            ? "Guardando..."
                            : isEditMode
                              ? "Actualizar Cita"
                              : "Crear Cita"}
                    </button>
                </div>
            </form>
        </div>
    );
}
