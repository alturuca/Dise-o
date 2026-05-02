import React, { useState } from 'react';
import CompraForm from '../components/CompraForm';
import { Truck, History } from 'lucide-react';

const Compras = () => {
  const [comprasRecientes, setComprasRecientes] = useState([]);

  const handleGuardarCompra = (nuevaCompra) => {
    // Aquí puedes recargar la lista de compras del servidor si quieres ver el historial
    setComprasRecientes([nuevaCompra, ...comprasRecientes]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
          <Truck size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Módulo de Compras</h1>
          <p className="text-sm text-gray-500 font-medium">Registra entradas de mercancía y actualiza el costo promedio.</p>
        </div>
      </div>

      {/* FORMULARIO */}
      <CompraForm onGuardar={handleGuardarCompra} />

      {/* HISTORIAL RÁPIDO (Opcional) */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <History size={18} className="text-gray-400" />
          <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Últimos Ingresos</h3>
        </div>
        <div className="p-8 text-center text-gray-400 text-sm italic">
          Las compras guardadas aparecerán en el módulo de Inventario y Reportes.
        </div>
      </div>
    </div>
  );
};

export default Compras;