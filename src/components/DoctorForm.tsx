"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createDoctor, updateDoctor } from "@/services/doctorService";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchDoctorById } from "@/services/doctorService";

export default function DoctorForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const doctortId = searchParams.get("id");
    const isEditMode = !!doctortId;
    const [loading, setLoading] = useState(true);
    console.log("id doctor:", doctortId);
    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        contactInfo: {
            phone: "",
            email: "",
        },
        schedule: [{ day: "Monday", startTime: "", endTime: "" }],
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                // Cargar doctores
                if (doctortId) {
                    const doctorsData = await fetchDoctorById(doctortId);
                    setFormData(doctorsData);
                }
            } finally {
                setLoading(false);
            }
        };

        // Si necesitas cargar datos al montar el componente, llama a loadInitialData aquí
        loadInitialData();
    }, [isEditMode, doctortId]);
    console.log("DoctorForm initialData:", formData);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index?: number,
        field?: string
    ) => {
        const { name, value } = e.target;

        if (index !== undefined && field) {
            const updatedSchedule = [...formData.schedule];
            updatedSchedule[index] = {
                ...updatedSchedule[index],
                [field]: value,
            };
            setFormData({ ...formData, schedule: updatedSchedule });
        } else if (name.startsWith("contactInfo.")) {
            const contactField = name.split(".")[1];
            setFormData({
                ...formData,
                contactInfo: {
                    ...formData.contactInfo,
                    [contactField]: value,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleAddSchedule = () => {
        setFormData({
            ...formData,
            schedule: [
                ...formData.schedule,
                { day: "Monday", startTime: "", endTime: "" },
            ],
        });
    };

    const handleRemoveSchedule = (index: number) => {
        const updatedSchedule = formData.schedule.filter((_, i) => i !== index);
        setFormData({ ...formData, schedule: updatedSchedule });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditMode && doctortId) {
                await updateDoctor(doctortId, formData);
                toast.success("Doctor actualizado correctamente");
            } else {
                await createDoctor(formData);
                toast.success("Doctor creado correctamente");
            }
            router.push("/doctors");
        } catch (error: any) {
            toast.error(error.message || "Error al guardar el doctor");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow space-y-6"
        >
            <h2 className="text-xl font-semibold mb-6">
                {isEditMode ? "Editar Doctor" : "Nuevo Doctor"}
            </h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                </label>
                <input
                    type="text"
                    name="name"
                    value={formData?.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Especialidad
                </label>
                <input
                    type="text"
                    name="specialty"
                    value={formData?.specialty}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                </label>
                <input
                    type="text"
                    name="contactInfo.phone"
                    value={formData?.contactInfo?.phone}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    name="contactInfo.email"
                    value={formData?.contactInfo?.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md border-gray-300"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horario
                </label>
                {formData?.schedule?.map((item, index) => (
                    <div key={index} className="flex gap-2 items-center mb-2">
                        <select
                            value={item.day}
                            onChange={(e) => handleChange(e, index, "day")}
                            className="w-full p-2 border rounded-md border-gray-300"
                        >
                            <option value="Monday">Lunes</option>
                            <option value="Tuesday">Martes</option>
                            <option value="Wednesday">Miércoles</option>
                            <option value="Thursday">Jueves</option>
                            <option value="Friday">Viernes</option>
                            <option value="Saturday">Sábado</option>
                        </select>
                        <input
                            type="time"
                            value={item.startTime}
                            onChange={(e) =>
                                handleChange(e, index, "startTime")
                            }
                            className="w-full p-2 border rounded-md border-gray-300"
                        />
                        <input
                            type="time"
                            value={item.endTime}
                            onChange={(e) => handleChange(e, index, "endTime")}
                            className="w-full p-2 border rounded-md border-gray-300"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveSchedule(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Eliminar
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddSchedule}
                    className="mt-2 text-blue-600 hover:underline text-sm"
                >
                    + Añadir horario
                </button>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {loading
                    ? "Guardando..."
                    : isEditMode
                      ? "Actualizar Doctor"
                      : "Crear Doctor"}
            </button>
        </form>
    );
}
