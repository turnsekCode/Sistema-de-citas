'use client';

import { useState, useEffect } from 'react';
import { fetchAppointmentStats } from '../../services/appointmentService';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await fetchAppointmentStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
        toast.error('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  if (!stats) {
    return <div>No hay datos disponibles</div>;
  }

  const statusData = [
    { name: 'Pendientes', value: stats.statusCounts.pending },
    { name: 'Confirmadas', value: stats.statusCounts.confirmed },
    { name: 'Canceladas', value: stats.statusCounts.cancelled },
    { name: 'Completadas', value: stats.statusCounts.completed },
  ];

  const monthlyData = Object.entries(stats.monthlyCounts).map(([month, count]) => ({
    name: month,
    citas: count,
  }));

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-sm font-medium text-blue-800">Total Citas</h3>
            <p className="text-2xl font-bold">{stats.totalAppointments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <h3 className="text-sm font-medium text-green-800">Citas Hoy</h3>
            <p className="text-2xl font-bold">{stats.todaysAppointments}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <h3 className="text-sm font-medium text-yellow-800">Citas Pendientes</h3>
            <p className="text-2xl font-bold">{stats.statusCounts.pending}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <h3 className="text-sm font-medium text-purple-800">Doctores</h3>
            <p className="text-2xl font-bold">{stats.totalDoctors}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Estados de Citas</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Citas por Mes</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="citas" fill="#82ca9d" name="Citas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}