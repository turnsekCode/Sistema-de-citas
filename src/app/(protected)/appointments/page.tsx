import { redirect } from "next/navigation";
import getServerSession from "@/lib/auth";
import AppointmentList from "@/components/AppoinmentList";
import CalendarComponent from "@/components/CalendarComponent";

export default async function AppointmentsPage() {
    const session = await getServerSession();
    console.log("Session appoinment:", session);
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                My Appointments
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lista de citas ocupa una columna completa en móvil/tablet, y 1/3 en desktop */}
                <div className="md:col-span-2 lg:col-span-2">
                    <AppointmentList />
                </div>

                {/* Calendario ocupa el resto: 2/3 en desktop */}
                <div className="md:col-span-2 lg:col-span-2">
                    <CalendarComponent />
                </div>
            </div>
        </div>
    );
}
