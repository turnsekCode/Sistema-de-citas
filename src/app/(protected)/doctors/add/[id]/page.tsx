import { redirect } from "next/navigation";
import getServerSession from "@/lib/auth";
import DoctorForm from "@/components/DoctorForm";

export default async function AppointmentsPage() {
    const session = await getServerSession();
    //console.log("Session appoinment:", session);
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Editar doctor
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 lg:col-span-2">
                    <DoctorForm />
                </div>
            </div>
        </div>
    );
}
