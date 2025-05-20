import { IDoctor } from "@/models/Doctor";

export async function fetchDoctors() {
    const res = await fetch("/api/doctors");
    if (!res.ok) throw new Error("Failed to fetch doctors");
    return await res.json();
}

export async function createDoctor(data: any) {
    const res = await fetch("/api/doctors", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create doctor");
    }
    return await res.json();
}

export async function fetchDoctorById(id: string): Promise<IDoctor> {
    const res = await fetch(`/api/doctors/${id}`);
    if (!res.ok) throw new Error("Failed to fetch doctor");
    return await res.json();
}

export async function updateDoctor(id: string, data: any) {
    const res = await fetch("/api/doctors", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...data }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update doctor");
    }
    return await res.json();
}

export async function deleteDoctor(id: string) {
    const res = await fetch("/api/doctors", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete doctor");
    }
    return await res.json();
}
