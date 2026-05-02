import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle, MoreVertical } from 'lucide-react';

const InventarioTable = ({ productos }) => {
  const formatearMoneda = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  return (
    <div className="overflow-x-auto text-black">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black border-b border-gray-100">
          <tr>
            <th className="px-6 py-4">SKU / Identificador</th>
            <th className="px-6 py-4">Producto / Descripción</th>
            <th className="px-6 py-4">Precio Compra</th>
            <th className="px-6 py-4">Precio Venta</th>
            <th className="px-6 py-4">Stock</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.isArray(productos) && productos.map((p) => (
            <tr key={p.sku} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">
                  {p.sku}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{p.nombre}</span>
                  <span className="text-[11px] text-gray-400 truncate max-w-[150px]">{p.descripcion}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500 italic">
                {formatearMoneda(p.precio_compra)}
              </td>
              <td className="px-6 py-4">
                <span className="font-black text-blue-600">{formatearMoneda(p.precio_venta)}</span>
              </td>
              <td className="px-6 py-4 font-black">
                {p.stock}
              </td>
              <td className="px-6 py-4">
                {p.stock === 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase">
                    <XCircle size={12} /> Agotado
                  </span>
                ) : p.stock < 10 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase border border-orange-100">
                    <AlertTriangle size={12} /> Stock Bajo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-black uppercase">
                    <CheckCircle2 size={12} /> Disponible
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <button className="p-2 hover:bg-gray-200 rounded-lg text-gray-400 transition-colors">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-20 text-center text-gray-400 font-medium">
                No se encontraron productos en el inventario.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioTable;