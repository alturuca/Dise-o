import React, { useState } from 'react';
import { Calendar, Clock, BarChart } from 'lucide-react';

const SelectorUtilidadPeriodo = ({ datos }) => {
  const [periodo, setPeriodo] = useState('diario'); // 'diario', 'semanal', 'mensual'

  const formatearCOP = (valor) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  const opciones = [
    { id: 'diario', label: 'Hoy', icon: <Clock size={16} /> },
    { id: 'semanal', label: 'Semana', icon: <Calendar size={16} /> },
    { id: 'mensual', label: 'Mes', icon: <BarChart size={16} /> },
  ];

  const dataActual = datos?.[periodo] || { ventas: 0, utilidad: 0 };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
      {/* Botonera de Selección */}
      <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 w-fit">
        {opciones.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setPeriodo(opt.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              periodo === opt.id 
              ? 'bg-[#0A1F44] text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Visualización de Datos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Ventas Totales</p>
          <p className="text-3xl font-black text-gray-900">{formatearCOP(dataActual.ventas)}</p>
        </div>
        
        <div className="space-y-1 p-4 bg-green-50 rounded-3xl border border-green-100">
          <p className="text-green-600 text-xs font-black uppercase tracking-widest">Utilidad Neta (40%)</p>
          <p className="text-3xl font-black text-green-700">{formatearCOP(dataActual.utilidad)}</p>
        </div>
      </div>

      {/* Barra visual de rendimiento */}
      <div className="mt-8">
        <div className="flex justify-between mb-2 text-[10px] font-black uppercase text-gray-400">
          <span>Eficiencia Operativa</span>
          <span className="text-green-600">40% Alcanzado</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-700 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
            style={{ width: '40%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SelectorUtilidadPeriodo;