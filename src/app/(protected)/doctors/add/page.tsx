"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const initialState = {
    name: "",
    specialty: "",
    schedule: [{ day: "Monday", startTime: "", endTime: "" }],
    contactInfo: {
        phone: "",
        email: "",
    },
};

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export default function DoctorForm() {
    const [doctor, setDoctor] = useState(initialState);
    const [isEditing, setIsEditing] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const doctorId = searchParams.get("id");

    useEffect(() => {
        if (doctorId) {
            setIsEditing(true);
            fetch(`/api/doctors/${doctorId}`)
                .then((res) => res.json())
                .then((data) => setDoctor(data))
                .catch((err) => {
                    console.error(err);
                    toast.error("Error cargando el doctor");
                });
        }
    }, [doctorId]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;

        if (name.includes("contactInfo.")) {
            const field = name.split(".")[1];
            setDoctor((prev) => ({
                ...prev,
                contactInfo: { ...prev.contactInfo, [field]: value },
            }));
        } else {
            setDoctor((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleScheduleChange = (
        index: number,
        field: "day" | "startTime" | "endTime",
        value: string
    ) => {
        const updatedSchedule = [...doctor.schedule];
        updatedSchedule[index][field] = value;
        setDoctor({ ...doctor, schedule: updatedSchedule });
    };

    const addSchedule = () => {
        setDoctor((prev) => ({
            ...prev,
            schedule: [
                ...prev.schedule,
                { day: "Monday", startTime: "", endTime: "" },
            ],
        }));
    };

    const removeSchedule = (index: number) => {
        const updated = doctor.schedule.filter((_, i) => i !== index);
        setDoctor({ ...doctor, schedule: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = isEditing ? "PUT" : "POST";
            const url = isEditing ? `/api/doctors/${doctorId}` : "/api/doctors";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(doctor),
            });

            if (!res.ok) throw new Error("Error al guardar el doctor");

            toast.success(
                `Doctor ${isEditing ? "actualizado" : "creado"} correctamente`
            );
            router.push("/doctors");
        } catch (err) {
            console.error(err);
            toast.error("Hubo un error al guardar el doctor");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow space-y-6"
        >
            <h2 className="text-xl font-semibold mb-6">
                {isEditing ? "Editar Doctor" : "Nuevo Doctor"}
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={doctor.name}
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
                        value={doctor.specialty}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md border-gray-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horario
                    </label>
                    {doctor.schedule.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 mb-2">
                            <select
                                value={s.day}
                                onChange={(e) =>
                                    handleScheduleChange(
                                        i,
                                        "day",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded-md border-gray-300"
                            >
                                {days.map((d) => (
                                    <option key={d} value={d}>
                                        {d}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="time"
                                value={s.startTime}
                                onChange={(e) =>
                                    handleScheduleChange(
                                        i,
                                        "startTime",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded-md border-gray-300"
                                required
                            />
                            <span>-</span>
                            <input
                                type="time"
                                value={s.endTime}
                                onChange={(e) =>
                                    handleScheduleChange(
                                        i,
                                        "endTime",
                                        e.target.value
                                    )
                                }
                                className="w-full p-2 border rounded-md border-gray-300"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => removeSchedule(i)}
                                className="text-red-600 hover:underline text-sm"
                            >
                                Quitar
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSchedule}
                        className="text-blue-600 hover:underline text-sm mt-2"
                    >
                        Añadir horario
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        name="contactInfo.phone"
                        value={doctor.contactInfo.phone}
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
                        value={doctor.contactInfo.email}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md border-gray-300"
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        {isEditing ? "Actualizar" : "Crear"}
                    </button>
                </div>
            </div>
        </form>
    );
}
