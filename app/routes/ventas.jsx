import React, { useState } from 'react';
import VentaForm from '../components/VentaForm';
import { ShoppingBag, History, CreditCard, FileDown } from 'lucide-react'; // Añadimos FileDown
import axios from 'axios';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);

  // --- FUNCIÓN PARA DESCARGAR EL PDF ---
  const descargarPDF = async (facturaId) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/facturas/${facturaId}/exportar_pdf/`, {
        headers: { 
          'Authorization': `Bearer ${token}` 
        },
        responseType: 'blob', // Necesario para manejar archivos binarios
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura_StocklyX_${facturaId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      alert("No se pudo obtener el PDF. Verifica que la factura exista en el servidor.");
    }
  };

  const handleGuardarVenta = async (datosDelFormulario) => {
  try {
    const token = localStorage.getItem('access_token');
    
    // 1. Enviar la venta al Backend (Django)
    const response = await axios.post('http://127.0.0.1:8000/api/v1/facturas/', datosDelFormulario, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const facturaCreada = response.data; // Aquí viene el ID real de la base de datos

    // 2. Actualizar el historial local con los datos reales
    const nuevosRegistros = datosDelFormulario.detalles.map((detalle) => ({
      id: facturaCreada.numero, // El número de factura generado por Django
      fecha: new Date().toLocaleDateString(),
      cliente: datosDelFormulario.cliente,
      producto: detalle.producto_nombre || "Producto", 
      cantidad: detalle.cantidad,
      precioUnitario: detalle.precio_unitario,
      subtotal: detalle.cantidad * detalle.precio_unitario
    }));

    setVentas((prev) => [...nuevosRegistros, ...prev]);

    // 3. OPCIONAL: Descargar automáticamente la factura recién creada
    descargarPDF(facturaCreada.numero);

  } catch (error) {
    console.error("Error al emitir factura:", error);
    alert("Error de conexión: " + (error.response?.data?.detail || "No se pudo guardar la venta en el servidor."));
  }
};

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CABECERA */}
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

      <div className="grid grid-cols-1 gap-6">
        <VentaForm onGuardar={handleGuardarVenta} />
      </div>

      {/* HISTORIAL RECIENTE CON BOTÓN DE PDF */}
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
                  <th className="px-6 py-3 text-center">Cant.</th>
                  <th className="px-6 py-3 text-right">Total</th>
                  <th className="px-6 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ventas.slice(0, 5).map((v, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 font-bold">{v.cliente}</td>
                    <td className="px-6 py-3">{v.producto}</td>
                    <td className="px-6 py-3 text-center">{v.cantidad}</td>
                    <td className="px-6 py-3 text-right font-black text-blue-600">
                      ${v.subtotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => descargarPDF(v.id)}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
                        title="Descargar Factura PDF"
                      >
                        <FileDown size={16} />
                      </button>
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