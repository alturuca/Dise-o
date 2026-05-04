import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  TrendingUp, 
  Hash,
  Target
} from 'lucide-react';

const ReporteVentas = () => {
  // Inicializamos con valores en 0 para que las tarjetas no rompan mientras carga la API
  const [ventas, setVentas] = useState([]);
  const [datosStats, setDatosStats] = useState({ hoy: 0, mes: 0, utilidad: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const META_MENSUAL = 10000000; 

  const fetchDatos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const resStats = await axios.get('http://127.0.0.1:8000/api/v1/reporte-ventas/', config);
      setDatosStats(resStats.data.totales);

      const resFacturas = await axios.get('http://127.0.0.1:8000/api/v1/facturas/', config);
      
      // ✅ SOLUCIÓN AL ERROR DE FECHA: Usar fecha local de Colombia (YYYY-MM-DD)
      // .toLocaleDateString('en-CA') siempre devuelve YYYY-MM-DD sin problemas de zona horaria
      const hoyLocal = new Date().toLocaleDateString('en-CA'); 
      
      const facturasHoy = resFacturas.data.filter(f => f.fecha.startsWith(hoyLocal));
      
      setVentas(facturasHoy);
    } catch (error) {
      console.error("Error cargando reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const formatearCOP = (v) => new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP', 
    maximumFractionDigits: 0 
  }).format(v || 0);

  // Cálculo de meta basado en el acumulado mensual del backend
  const porcentajeMeta = Math.min(Math.round(((datosStats?.mes || 0) / META_MENSUAL) * 100), 100);

  if (loading) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <div className="text-blue-900 font-black animate-pulse text-xl tracking-tighter uppercase">Generando reporte diario...</div>
      <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full animate-progress-loading w-1/3"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 text-black pb-10">
      
      {/* HEADER DE NAVEGACIÓN */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/reportes')}
            className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:text-blue-600 active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-tight">Ventas del Día</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-[#0A1F44] text-white rounded-2xl font-black text-xs hover:bg-blue-900 transition-all shadow-xl shadow-blue-200 uppercase tracking-tighter">
          <Download size={18} /> Exportar PDF
        </button>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TARJETA HOY: Muestra el acumulado bruto del día */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
          <TrendingUp size={100} className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          <p className="text-blue-100 font-black text-[10px] uppercase tracking-[0.2em]">Total Recaudado Hoy</p>
          <h2 className="text-5xl font-black mt-2 tracking-tighter">
            {formatearCOP(datosStats?.hoy)}
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">Caja Popayán</span>
          </div>
        </div>

        {/* TARJETA MES: Muestra el rendimiento mensual contra la meta */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-center relative group">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">Rendimiento Mensual</p>
              <h2 className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">
                {formatearCOP(datosStats?.mes)}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <Target size={12} /> {porcentajeMeta}% META
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-50 h-3 rounded-full mt-4 overflow-hidden shadow-inner border border-gray-100">
            <div 
              className="bg-blue-600 h-full transition-all duration-1000 ease-out rounded-full shadow-lg shadow-blue-200" 
              style={{ width: `${porcentajeMeta}%` }} 
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-4 font-black uppercase tracking-widest text-center">
            Meta Sugerida: {formatearCOP(META_MENSUAL)}
          </p>
        </div>
      </div>

      {/* TABLA DE REGISTROS DETALLADOS */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Facturas de hoy</h3>
          </div>
          <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-lg">
            {ventas.length} TRANSACCIONES
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 border-b">
              <tr>
                <th className="px-8 py-4"><Hash size={14} /></th>
                <th className="px-8 py-4">Cliente</th>
                <th className="px-8 py-4 text-center">Items</th>
                <th className="px-8 py-4 text-right">Monto Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ventas.map((v) => (
                <tr key={v.id || v.numero} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5 font-mono text-blue-600 font-black text-xs">#{v.numero || v.id}</td>
                  <td className="px-8 py-5 font-black text-gray-800 uppercase text-[11px] tracking-tight">{v.cliente || 'Consumidor Final'}</td>
                  <td className="px-8 py-5 text-center">
                     <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black text-[9px] border border-blue-100">
                       {v.detalles?.length || 0} ITEMS
                     </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-gray-900 text-lg tracking-tighter">
                    {formatearCOP(v.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteVentas;