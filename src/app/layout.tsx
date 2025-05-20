import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
//import Navbar from "../components/Navbar";
import ToastContainer from "@/components/ToastContainer";
import Navbar from '@/components/Navbar/index';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Sistema de Citas Médicas",
    description: "Sistema para gestión de citas médicas",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                <AuthProvider>
                    <div className="min-h-screen bg-gray-50">
                        <Navbar />
                        <main className="container mx-auto px-4 py-8">
                            {children}
                        </main>
                         <Footer />
                    </div>
                    <ToastContainer />
                </AuthProvider>
            </body>
        </html>
    );
}
