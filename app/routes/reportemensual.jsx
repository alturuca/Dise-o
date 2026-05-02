import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  ArrowUpRight,
  Download
} from 'lucide-react';

const ReporteMensual = () => {
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDatosMes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/v1/reporte-ventas/', {
        headers: { Authorization: `Bearer ${token}` }
      });
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

  if (loading) return <div className="p-20 text-center font-black animate-pulse text-blue-900">CARGANDO BALANCE MENSUAL...</div>;

  const ventasMes = datos?.ventas_mes || 0;
  const utilidadMes = datos?.utilidad_mes || (ventasMes * 0.40);
  const ticketPromedio = datos?.ticket_promedio_mes || 0;
  const facturasMes = datos?.conteo_facturas_mes || 0;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-black pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/reportes')} className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Balance Mensual</h1>
            <p className="text-sm text-gray-500 font-medium">Análisis de ingresos: Marzo 2026</p>
          </div>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600 group-hover:scale-110 transition-transform">
            <DollarSign size={80} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ventas Acumuladas</p>
          <h2 className="text-3xl font-black text-blue-900 mt-2">{formatearCOP(ventasMes)}</h2>
          <div className="flex items-center gap-1 text-green-500 mt-4 font-bold text-xs">
                      
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ticket Promedio</p>
          <h2 className="text-3xl font-black text-gray-900 mt-2">{formatearCOP(ticketPromedio)}</h2>
          <p className="text-xs text-gray-400 mt-4 font-medium italic">Basado en {facturasMes} facturas reales.</p>
        </div>

        <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Utilidad Bruta (40%)</p>
          <h2 className="text-3xl font-black text-blue-700 mt-2">{formatearCOP(utilidadMes)}</h2>
          <p className="text-xs text-blue-500 mt-4 font-bold">Ganancia proyectada StocklyX.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* GRÁFICA DE TENDENCIA CON ALTO CONTRASTE */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" /> Tendencia Semanal Real
          </h3>
          
          <div className="h-56 w-full bg-[#0A1F44] rounded-[2rem] flex items-end justify-around p-8 gap-3 shadow-inner shadow-black/20">
            {datos?.tendencia_semanal?.map((item, i) => {
              const maxVenta = Math.max(...datos.tendencia_semanal.map(s => s.ventas), 1);
              const altura = Math.max((item.ventas / maxVenta) * 100, 10);
              const esMejorSemana = item.ventas === maxVenta && item.ventas > 0;
              
              return (
                <div key={i} className="group relative w-full flex flex-col items-center">
                  {/* Tooltip con alto contraste */}
                  <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-all bg-white text-gray-900 text-[10px] py-1.5 px-3 rounded-xl font-black z-20 whitespace-nowrap shadow-2xl border border-gray-100">
                    {formatearCOP(item.ventas)}
                  </div>
                  
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-700 cursor-pointer shadow-lg 
                      ${esMejorSemana ? 'bg-green-400 hover:bg-green-300 shadow-green-900/40' : 'bg-blue-300 hover:bg-white shadow-blue-950/20'}`} 
                    style={{ height: `${altura}%` }}
                  >
                    <div className="h-1 w-[70%] bg-white/20 rounded-full mt-1 mx-auto"></div>
                  </div>
                  
                  <span className={`text-[9px] font-black mt-3 uppercase tracking-tighter ${esMejorSemana ? 'text-green-300' : 'text-blue-200 opacity-60'}`}>
                    {item.nombre}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-gray-400 mt-5 font-bold uppercase tracking-widest bg-gray-50 py-2 rounded-xl mx-4">
            Flujo de caja
          </p>
        </div>

        {/* DISTRIBUCIÓN FINANCIERA */}
        <div className="bg-[#0A1F44] p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/20">
          <h3 className="font-black mb-6 flex items-center gap-2">
            <PieChart size={18} className="text-blue-400" /> Distribución Financiera
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold opacity-70">Inversión Mercancía (60%)</span>
                <span className="font-black">{formatearCOP(ventasMes * 0.6)}</span>
              </div>
              <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
                 <div className="bg-blue-400 h-full w-[60%] transition-all duration-1000"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold opacity-70 text-green-400">Utilidad Bruta (40%)</span>
                <span className="font-black text-green-400">{formatearCOP(utilidadMes)}</span>
              </div>
              <div className="w-full bg-blue-900/50 h-2 rounded-full overflow-hidden">
                 <div className="bg-green-400 h-full w-[40%] transition-all duration-1000"></div>
              </div>
            </div>
          </div>
          <p className="mt-10 text-[11px] text-blue-300 italic leading-relaxed border-t border-blue-800/50 pt-4">
            Análisis de rentabilidad para la toma de decisiones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReporteMensual;