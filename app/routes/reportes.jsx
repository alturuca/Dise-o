import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReporteCard from '../components/ReporteCard';
import GraficasReporte from '../components/GraficasReporte';
import { useNavigate } from 'react-router';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  AlertCircle,
  Calendar
} from 'lucide-react';

// Endpoints definidos correctamente
const API_DASHBOARD = 'http://127.0.0.1:8000/api/v1/dashboard-stats/';
const API_GRAFICOS = 'http://127.0.0.1:8000/api/v1/reporte-ventas/';

const Reportes = () => {
  const [datos, setDatos] = useState(null);
  const [tendencia, setTendencia] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReportes = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) { navigate('/'); return; }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Ejecutamos ambas peticiones al tiempo para que cargue rápido
      const [resStats, resGraficos] = await Promise.all([
        axios.get(API_DASHBOARD, config),
        axios.get(API_GRAFICOS, config)
      ]);
      
      // 1. Cargamos los totales (Hoy, Mes, Utilidad) desde DashboardStatsView
      if (resStats.data.totales) {
        setDatos(resStats.data.totales);
      }

      // 2. Cargamos la tendencia desde ReporteVentasView
      if (resGraficos.data.tendencia_semanal) {
        setTendencia(resGraficos.data.tendencia_semanal);
      }
      
    } catch (error) {
      console.error('Error al obtener reportes en StocklyX:', error);
      if (error.response?.status === 401) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  const formatearCOP = (valor) =>
    new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        maximumFractionDigits: 0 
    }).format(valor || 0);

  if (loading) return (
    <div className="flex h-96 flex-col items-center justify-center gap-4">
      <div className="text-blue-900 font-black animate-pulse text-xl tracking-tighter uppercase">Generando informes financieros...</div>
      <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full animate-progress-loading w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-black pb-10">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="p-4 bg-[#0A1F44] text-white rounded-2xl shadow-lg shadow-blue-200">
          <BarChart3 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Análisis de Negocio</h1>
          <p className="text-sm text-gray-500 font-medium tracking-tight">Rendimiento financiero en Popayán.</p>
        </div>
      </div>

      {/* GRID DE REPORTES (Datos de DashboardStatsView) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReporteCard 
          titulo="Ventas de Hoy" 
          valor={formatearCOP(datos?.hoy)} 
          color="#4caf50" 
          icon={<TrendingUp size={24} />}
          onClick={() => navigate('/reporteventas')}
        />
        <ReporteCard 
          titulo="Ventas del Mes" 
          valor={formatearCOP(datos?.mes)} 
          color="#2196f3" 
          icon={<Calendar size={24} />}
          onClick={() => navigate('/reportemensual')}
        />
        <ReporteCard 
          titulo="Utilidad Neta Real" 
          valor={formatearCOP(datos?.utilidad)} 
          color="#9c27b0" 
          icon={<DollarSign size={24} />}
          onClick={() => navigate('/analisis-detallado')}
        />
      </div>

      {/* SECCIÓN DE GRÁFICAS (Datos de ReporteVentasView) */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[350px] flex flex-col justify-center">
         {tendencia.length > 0 ? (
           <GraficasReporte datosVentas={tendencia} />
         ) : (
           <div className="text-center">
             <BarChart3 size={40} className="mx-auto text-gray-200 mb-2" />
             <p className="text-gray-400 font-bold text-sm italic">
               No hay ventas registradas en los últimos 28 días.
             </p>
           </div>
         )}
      </div>

      {/* FOOTER INFORMATIVO */}
      <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
            <AlertCircle size={20} />
        </div>
        <p className="text-xs text-blue-800 font-medium italic">
            La utilidad se calcula restando el costo de adquisición al valor total de la venta por cada producto.
        </p>
      </div>
    </div>
  );
};

export default Reportes;