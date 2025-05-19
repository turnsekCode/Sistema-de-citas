interface ProfileFormProps {
    user: {
        _id: string;
        name: string;
        email: string;
    };
}

export default async function ProfilePage({ user }: ProfileFormProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
            <div className="mb-2">
                <span className="font-semibold">Nombre: </span>
                <span>{user.name}</span>
            </div>
        </div>
    );
}
