import React, { useState } from 'react';
import VentaForm from '../components/VentaForm';
import { ShoppingBag, History, CreditCard } from 'lucide-react';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  const handleGuardarVenta = (nuevaVenta) => {
    // Generamos un ID basado en el timestamp para evitar duplicados
    const ventaId = Date.now();
    
    const nuevosRegistros = nuevaVenta.detalles.map((detalle) => ({
      id: ventaId,
      fecha: new Date().toLocaleDateString(),
      cliente: nuevaVenta.cliente,
      producto: detalle.producto,
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precio_unitario,
      subtotal: detalle.cantidad * detalle.precio_unitario
    }));

    setVentas((prev) => [...nuevosRegistros, ...prev]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CABECERA DE LA PÁGINA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Punto de Venta (POS)</h1>
            <p className="text-sm text-gray-500 font-medium">Registra ventas y actualiza el stock al instante.</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100 flex items-center gap-2">
            <CreditCard size={18} />
            <span className="font-bold">Caja Abierta</span>
          </div>
        </div>
      </div>

      {/* COMPONENTE PRINCIPAL DEL FORMULARIO */}
      <div className="grid grid-cols-1 gap-6">
        <VentaForm onGuardar={handleGuardarVenta} />
      </div>

      {/* HISTORIAL RECIENTE (Opcional debajo del form) */}
      {ventas.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex items-center gap-2 font-bold text-gray-700 text-sm">
            <History size={18} /> ÚLTIMOS MOVIMIENTOS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/50 text-gray-400 uppercase font-black">
                <tr>
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Producto</th>
                  <th className="px-6 py-3">Cant.</th>
                  <th className="px-6 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ventas.slice(0, 5).map((v, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-bold">{v.cliente}</td>
                    <td className="px-6 py-3">{v.producto}</td>
                    <td className="px-6 py-3">{v.cantidad}</td>
                    <td className="px-6 py-3 text-right font-black text-blue-600">
                      ${v.subtotal.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ventas;