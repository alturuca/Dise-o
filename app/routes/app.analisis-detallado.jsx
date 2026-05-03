import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, DollarSign, PieChart, Calendar } from 'lucide-react';
import SelectorUtilidadPeriodo from '../components/SelectorUtilidadPeriodo';

export default function AnalisisDetallado() {
  const navigate = useNavigate();  
  const [datos, setDatos] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('access_token'); // Recuperar token
  
  fetch('http://127.0.0.1:8000/api/v1/reporte-utilidad/', {
    headers: {
      'Authorization': `Bearer ${token}`, // Header vital
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => setDatos(data))
    .catch(err => console.error("Error en StocklyX:", err));
}, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-8 text-black">
      {/* Botón para volver */}
      <button 
        onClick={() => navigate('/reportes')}
        className="flex items-center gap-2 text-gray-500 hover:text-black font-bold transition-all"
      >
        <ArrowLeft size={20} /> Volver a Reportes Generales
      </button>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Encabezado de la página */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-green-500 text-white rounded-3xl shadow-xl shadow-green-200 mb-2">
            <PieChart size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Reporte de Utilidad Estimada</h1>
          <p className="text-gray-500 max-w-lg mx-auto font-medium">
            Análisis profundo de rentabilidad basado en un margen operativo del <span className="text-green-600 font-bold">40%</span> sobre el volumen de ventas.
          </p>
        </div>

        {/* El componente interactivo que diseñamos antes */}
        <div className="shadow-2xl shadow-blue-900/5">
          <SelectorUtilidadPeriodo datos={datos} />
        </div>

        {/* Sección de desglose informativo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
            <h4 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-500" /> ¿Cómo calculamos esto?
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Debido a que el inventario de <strong>StocklyX</strong> utiliza registros históricos de texto para los productos, aplicamos un factor de rendimiento del <strong>0.4 (40%)</strong>. Este margen cubre el costo de adquisición de mercancía y deja un excedente para gastos operativos.
            </p>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}