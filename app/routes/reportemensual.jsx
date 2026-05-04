import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Download
} from 'lucide-react';

const ReporteMensual = () => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const META_MENSUAL = 10000000; 

  const fetchDatosMes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Llamamos al endpoint que ya confirmaste que funciona bien
      const res = await axios.get('http://127.0.0.1:8000/api/v1/reporte-ventas/', config);
      
      // Guardamos la respuesta completa para tener acceso a 'totales' y 'ventas_mes'
      setDatos(res.data);
    } catch (error) {
      console.error("Error al cargar balance mensual:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatosMes();
  }, []);

  const formatearCOP = (v) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(v || 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-blue-900 font-black animate-pulse text-xl uppercase tracking-tighter">
        Sincronizando Balance Mensual...
      </div>
    </div>
  );

  // --- LÓGICA DE EXTRACCIÓN ROBUSTA ---
  // Si res.data tiene 'totales', usamos 'totales.mes'. Si no, usamos 'ventas_mes'.
  const ventasMes = datos?.totales?.mes || datos?.ventas_mes || 0;
  const utilidadMes = datos?.totales?.utilidad || datos?.utilidad_mes || (ventasMes / 1.19 * 0.40);
  const ticketPromedio = datos?.ticket_promedio_mes || 0;
  const facturasMes = datos?.conteo_facturas_mes || 0;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-black pb-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/reportes')} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-all active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Balance Mensual</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
               Análisis de ingresos acumulados
            </p>
          </div>
        </div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#0A1F44] text-white rounded-2xl font-black text-xs uppercase tracking-tighter shadow-lg shadow-blue-200">
          <Download size={18} /> Exportar Datos
        </button>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-blue-600 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ventas del Mes</p>
          <h2 className="text-4xl font-black text-blue-900 mt-2 tracking-tighter">
            {formatearCOP(ventasMes)}
          </h2>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket Promedio</p>
          <h2 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter">
            {formatearCOP(ticketPromedio)}
          </h2>
          <p className="text-xs text-gray-400 mt-4 font-medium italic">En {facturasMes} transacciones.</p>
        </div>

        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-200">
          <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Utilidad Estimada</p>
          <h2 className="text-4xl font-black mt-2 tracking-tighter">
            {formatearCOP(utilidadMes)}
          </h2>
        </div>
      </div>

      {/* DISTRIBUCIÓN Y GRÁFICA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0A1F44] p-8 rounded-[2.5rem] text-white">
          <h3 className="font-black mb-8 flex items-center gap-2 uppercase text-xs tracking-widest text-blue-400">
            <PieChart size={18} /> Composición Financiera
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold opacity-70 uppercase">Costo Mercancía (60%)</span>
              <span className="font-black tracking-tighter">{formatearCOP(ventasMes * 0.60)}</span>
            </div>
            <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-[60%]"></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-green-400 uppercase">Utilidad Bruta (40%)</span>
              <span className="font-black text-green-400 tracking-tighter">{formatearCOP(utilidadMes)}</span>
            </div>
            <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
              <div className="bg-green-400 h-full w-[40%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
            <TrendingUp size={18} className="text-blue-600" /> Rendimiento de Ventas
          </h3>
          <div className="h-48 w-full bg-gray-50 rounded-3xl flex items-end justify-around p-6 gap-2">
            {datos?.tendencia_semanal?.map((item, i) => (
              <div key={i} className="group relative w-full flex flex-col items-center">
                <div 
                  className="w-full bg-blue-200 rounded-t-lg transition-all hover:bg-blue-600" 
                  style={{ height: `${Math.max((item.ventas / (ventasMes || 1)) * 100, 15)}%` }}
                ></div>
                <span className="text-[8px] font-black mt-2 text-gray-400">{item.nombre}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteMensual;