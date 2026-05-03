import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  PieChart, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import SelectorUtilidadPeriodo from '../components/SelectorUtilidadPeriodo';

export default function AnalisisDetallado() {
  const navigate = useNavigate();  
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUtilidad = async () => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/reporte-utilidad/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Header necesario para JWT
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo obtener el reporte`);
      }

      const data = await response.json();
      setDatos(data);
    } catch (err) {
      console.error("Error en StocklyX:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilidad();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8 text-black pb-20">
      
      {/* NAVEGACIÓN */}
      <button 
        onClick={() => navigate('/reportes')}
        className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all active:scale-95"
      >
        <ArrowLeft size={18} /> Volver a Reportes
      </button>

      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-5 bg-[#10b981] text-white rounded-[2rem] shadow-xl shadow-green-100 mb-2">
            <PieChart size={35} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
            Utilidad Estimada <span className="text-green-500">StocklyX</span>
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto font-medium text-sm leading-relaxed">
            Análisis de rentabilidad basado en un margen operativo del <span className="text-green-600 font-black">40%</span> sobre el volumen total de ventas.
          </p>
        </div>

        {/* CONTENEDOR PRINCIPAL DE DATOS */}
        <div className="relative min-h-[400px] flex flex-col justify-center">
          {loading ? (
            <div className="bg-white p-20 rounded-[3rem] border border-gray-100 shadow-sm text-center space-y-4">
              <RefreshCw className="mx-auto text-blue-600 animate-spin" size={40} />
              <p className="text-blue-900 font-black text-xs uppercase tracking-[0.2em]">Procesando algoritmos financieros...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-12 rounded-[3rem] border border-red-100 text-center space-y-4">
              <AlertCircle className="mx-auto text-red-500" size={40} />
              <p className="text-red-800 font-bold text-sm">{error}</p>
              <button 
                onClick={fetchUtilidad}
                className="px-6 py-2 bg-red-600 text-white rounded-xl font-black text-xs uppercase"
              >
                Reintentar conexión
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in zoom-in-95 duration-700">
                <SelectorUtilidadPeriodo datos={datos} />
            </div>
          )}
        </div>

        {/* NOTA TÉCNICA */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <TrendingUp size={30} />
          </div>
          <div>
            <h4 className="font-black text-gray-900 mb-2 uppercase text-xs tracking-widest">Metodología de Cálculo</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Debido a la estructura de registros históricos en Popayán, aplicamos un factor de rendimiento del <strong>0.4</strong>. Este margen proyectado permite visualizar la liquidez neta tras cubrir costos de adquisición de mercancía.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}