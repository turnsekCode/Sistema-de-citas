import { redirect } from "next/navigation";
import getServerSession from "@/lib/auth";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
            <ProfileForm user={session.user} />
        </div>
    );
}
