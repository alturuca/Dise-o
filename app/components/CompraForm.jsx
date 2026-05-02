import React, { useState } from 'react';
import axios from 'axios';
import { Search, Plus, Truck, Package, DollarSign, Trash2, Save } from 'lucide-react';

const PRODUCTOS_API = 'http://127.0.0.1:8000/api/v1/productos/';
const INGRESO_API = 'http://127.0.0.1:8000/api/v1/ingresos/'; // Ajustado a tu router de Django

const CompraForm = ({ onGuardar }) => {
  const [sku, setSku] = useState('');
  const [productoActual, setProductoActual] = useState(null);
  const [cantidad, setCantidad] = useState('1');
  const [precioCompra, setPrecioCompra] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [detalles, setDetalles] = useState([]);

  const buscarProducto = async () => {
    const cleanSku = sku.trim();
    if (!cleanSku) return;
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.get(`${PRODUCTOS_API}${cleanSku}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductoActual(res.data);
      // Sugerir el último precio de compra si existe en el modelo
      setPrecioCompra(res.data.precio_compra || '');
    } catch (error) {
      alert('Producto no registrado en inventario.');
      setProductoActual(null);
    }
  };

  const agregarProducto = () => {
    if (!productoActual || !cantidad || !precioCompra) {
      alert('Completa producto, cantidad y precio de compra');
      return;
    }

    const cantidadInt = Math.floor(Number(cantidad));
    const precioFloat = parseFloat(precioCompra);

    if (cantidadInt <= 0 || precioFloat <= 0) {
      alert('Valores deben ser mayores a cero');
      return;
    }

    const nuevoDetalle = {
      nombre: productoActual.nombre,
      sku: productoActual.sku,
      cantidad: cantidadInt,
      precio_compra: precioFloat,
      subtotal: cantidadInt * precioFloat
    };

    setDetalles([nuevoDetalle, ...detalles]);
    // Limpiar para el siguiente item
    setSku('');
    setProductoActual(null);
    setCantidad('1');
    setPrecioCompra('');
  };

  const eliminarDetalle = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!proveedor || detalles.length === 0) {
      alert('Ingresa proveedor y al menos un producto');
      return;
    }

    const datosCompra = {
      proveedor,
      // Mapeamos al formato que espera tu Serializer de Django
      detalles: detalles.map(d => ({
        sku: d.sku,
        cantidad: d.cantidad,
        precio_compra: d.precio_compra
      }))
    };

    try {
      const res = await axios.post(INGRESO_API, datosCompra, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onGuardar(res.data);
      setProveedor('');
      setDetalles([]);
      alert('Compra registrada y stock actualizado');
    } catch (error) {
      console.error(error);
      alert('Error al registrar ingreso');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-black">
      {/* LADO IZQUIERDO: ENTRADA */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-blue-900">
            <Truck size={20} /> Entrada de Stock
          </h3>

          <div className="space-y-3">
            <div className="relative">
              <Truck className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Proveedor / Nit" value={proveedor} onChange={(e) => setProveedor(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Package className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  type="text" placeholder="SKU Producto" value={sku} onChange={(e) => setSku(e.target.value)} onBlur={buscarProducto}
                />
              </div>
              <button type="button" onClick={buscarProducto} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200"><Search size={18}/></button>
            </div>

            {productoActual && (
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 space-y-3 animate-in zoom-in duration-200">
                <p className="text-xs font-black text-green-800 uppercase">{productoActual.nombre}</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number" placeholder="Cant." value={cantidad}
                    className="w-full p-2 rounded-lg border border-green-200 text-sm font-bold"
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                  <input
                    type="number" placeholder="Precio Compra" value={precioCompra}
                    className="w-full p-2 rounded-lg border border-green-200 text-sm font-bold"
                    onChange={(e) => setPrecioCompra(e.target.value)}
                  />
                </div>
                <button 
                  type="button" onClick={agregarProducto}
                  className="w-full py-2 bg-green-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> CARGAR A LISTA
                </button>
              </div>
            )}

            <button 
              onClick={handleSubmit} disabled={detalles.length === 0}
              className="w-full py-4 bg-[#0A1F44] text-white rounded-2xl font-black mt-4 disabled:bg-gray-200 flex items-center justify-center gap-2"
            >
              <Save size={18} /> GUARDAR INGRESO
            </button>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: LISTA PREVIA */}
      <div className="lg:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-black text-[10px] text-gray-400 uppercase tracking-widest">Items por ingresar a bodega</h3>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Cant.</th>
                <th className="px-6 py-4">Costo Unit.</th>
                <th className="px-6 py-4">Subtotal</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {detalles.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-bold">{item.nombre}</td>
                  <td className="px-6 py-4">{item.cantidad}</td>
                  <td className="px-6 py-4 text-gray-500">${item.precio_compra}</td>
                  <td className="px-6 py-4 font-black">${item.subtotal}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => eliminarDetalle(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
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

export default CompraForm;