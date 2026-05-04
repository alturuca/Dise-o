import React from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle2, XCircle, Trash2, Edit } from 'lucide-react';

const PRODUCTOS_API = 'http://127.0.0.1:8000/api/v1/productos/';

const InventarioTable = ({ productos, setProductos }) => {
  const formatearMoneda = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  // --- FUNCIÓN PARA ELIMINAR DESDE EL FRONTEND ---
  const manejarEliminar = async (sku, nombre) => {
  // 1. Verificación de seguridad para el estado
    if (typeof setProductos !== 'function') {
      console.error("Error: setProductos no está definido como función.");
      return;
    }

    const token = localStorage.getItem('access_token');
    
    if (window.confirm(`¿Estás seguro de eliminar "${nombre}" del inventario?`)) {
      try {
        // 2. Intento de eliminación física en el backend
        const response = await axios.delete(`${PRODUCTOS_API}${sku}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // 3. Si tiene éxito (status 204), actualizamos la interfaz
        setProductos(productos.filter(p => p.sku !== sku));
        alert("Producto eliminado exitosamente.");

      } catch (error) {
        console.error("Detalle del error al eliminar:", error);

        // 4. Manejo de errores específicos (como el 400 por historial)
        if (error.response) {
          // Capturamos el mensaje de error configurado en el backend
          const mensajeServidor = error.response.data.error || error.response.data.detail;
          
          if (error.response.status === 400) {
            alert(`Restricción de Inventario: ${mensajeServidor}`);
          } else if (error.response.status === 401) {
            alert("Sesión expirada. Por favor, vuelve a iniciar sesión.");
          } else {
            alert("Error interno del servidor. Revisa los logs de Django.");
          }
        } else {
          alert("No se pudo conectar con el servidor de StocklyX.");
        }
      }
    }
  };
  return (
    <div className="overflow-x-auto text-black bg-white rounded-[2rem] shadow-sm border border-gray-100">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black border-b border-gray-100">
          <tr>
            <th className="px-6 py-4">SKU / Identificador</th>
            <th className="px-6 py-4">Producto / Descripción</th>
            <th className="px-6 py-4 text-right">Precio Venta</th>
            <th className="px-6 py-4 text-center">Stock</th>
            <th className="px-6 py-4 text-center">Estado</th>
            <th className="px-6 py-4 text-center">Acciones</th>
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
              <td className="px-6 py-4 text-right">
                <span className="font-black text-blue-600">{formatearMoneda(p.precio_venta)}</span>
              </td>
              <td className="px-6 py-4 text-center font-black">
                {p.stock}
              </td>
              <td className="px-6 py-4 text-center">
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
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {/* Botón de editar (funcionalidad base) */}
                  <button className="p-2 hover:bg-blue-50 text-blue-400 hover:text-blue-600 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>

                  {/* BOTÓN ELIMINAR: Solo activo si el stock es 0 según negocio_db.sql */}
                  {p.stock === 0 && (
                    <button 
                      onClick={() => manejarEliminar(p.sku, p.nombre)}
                      className="p-2 hover:bg-red-50 text-red-400 hover:text-red-600 rounded-lg transition-colors"
                      title="Eliminar producto agotado"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioTable;