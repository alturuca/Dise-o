import React, { useState } from 'react';
import axios from 'axios';
import { 
  Search, Plus, ShoppingCart, User, Package, 
  DollarSign, CheckCircle, Calculator, ArrowRight 
} from 'lucide-react';

const PRODUCTOS_API = 'http://127.0.0.1:8000/api/v1/productos/';
const FACTURAS_API = 'http://127.0.0.1:8000/api/v1/facturas/';

const VentaForm = ({ onGuardar }) => {
  const [sku, setSku] = useState('');
  const [productoActual, setProductoActual] = useState(null);
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('1'); 
  const [detalles, setDetalles] = useState([]);
  const [mostrarVuelto, setMostrarVuelto] = useState(false);
  const [dineroRecibido, setDineroRecibido] = useState('');
  const [cambio, setCambio] = useState(0);

  // --- LÓGICA DE DINERO Y CAMBIO ---
  const manejarDineroRecibido = (valor) => {
    setDineroRecibido(valor);
    const recibido = parseFloat(valor) || 0;
    setCambio(recibido - totalVenta);
  };

  // ✅ CORRECCIÓN: Se envían los datos antes de resetear el estado
  const finalizarProceso = () => {
    if (onGuardar) {
      onGuardar({
        cliente: cliente,
        detalles: detalles
      });
    }
    
    // Reseteo del formulario
    setMostrarVuelto(false);
    setCliente('');
    setDetalles([]);
    setDineroRecibido('');
    setCambio(0);
    setSku('');
  };

  // --- LÓGICA DE PRODUCTOS ---
  const buscarProducto = async () => {
    const cleanSku = sku.trim();
    if (!cleanSku) return;
    const token = localStorage.getItem('access_token');
    try {
      const res = await axios.get(`${PRODUCTOS_API}${cleanSku}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductoActual(res.data);
    } catch (error) {
      alert('Producto no encontrado en la base de datos.');
      setProductoActual(null);
    }
  };

  const agregarProducto = () => {
    if (!productoActual) return;
    
    const cantidadInt = Math.floor(Number(cantidad));

    if (isNaN(cantidadInt) || cantidadInt <= 0) {
      alert('La cantidad debe ser un número entero mayor a 0');
      setCantidad('1');
      return;
    }

    if (productoActual.stock < cantidadInt) {
      alert(`¡Atención! Solo quedan ${productoActual.stock} unidades.`);
      return;
    }

    const detalle = {
      nombre: productoActual.nombre,
      producto: productoActual.sku,
      cantidad: cantidadInt,
      precio_unitario: parseFloat(productoActual.precio_venta),
    };

    setDetalles([detalle, ...detalles]);

    // Actualización de stock en Django (Opcional si tu backend ya lo hace en el POST de factura)
    const nuevoStock = productoActual.stock - cantidadInt;
    const token = localStorage.getItem('access_token');
    axios.put(`${PRODUCTOS_API}${productoActual.sku}/`, {
      ...productoActual,
      stock: nuevoStock,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(err => console.error("Error stock:", err));

    setSku('');
    setProductoActual(null);
    setCantidad('1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token || !cliente || detalles.length === 0) {
      alert("Completa el cliente y agrega productos.");
      return;
    }

    const factura = { cliente, detalles };
    try {
      await axios.post(FACTURAS_API, factura, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      setMostrarVuelto(true);
    } catch (error) {
      alert('Error al procesar la factura en el servidor.');
    }
  };

  const totalVenta = detalles.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);

  const formatearCOP = (valor) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-black relative">
      
      {/* PANEL IZQUIERDO: FORMULARIO */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#0A1F44]">
            <ShoppingCart size={20} /> Registro de Venta
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                type="text" placeholder="Nombre del Cliente" value={cliente} onChange={(e) => setCliente(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Package className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  type="text" placeholder="SKU / Código" value={sku} onChange={(e) => setSku(e.target.value)} onBlur={buscarProducto}
                />
              </div>
              <button type="button" onClick={buscarProducto} className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                <Search size={20} className="text-gray-600" />
              </button>
            </div>

            {productoActual && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in zoom-in duration-300 space-y-4">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-blue-900 text-xs uppercase">{productoActual.nombre}</p>
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                    STOCK: {productoActual.stock}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cantidad</label>
                    <input
                      className="w-full px-3 py-2 border border-blue-200 rounded-xl outline-none bg-white font-black text-black text-center text-lg focus:ring-2 focus:ring-blue-500"
                      type="number" min="1" value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" onClick={agregarProducto} 
                    className="h-[46px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    <Plus size={14} /> AGREGAR
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" disabled={detalles.length === 0} 
              className="w-full py-4 bg-[#0A1F44] hover:bg-blue-900 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 disabled:bg-gray-200 mt-4 flex items-center justify-center gap-3"
            >
              FINALIZAR VENTA <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* PANEL DERECHO: DETALLE */}
      <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[450px]">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
          <h3 className="font-bold text-gray-700 uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Calculator size={16} /> Detalle de Factura
          </h3>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-black uppercase">Total Neto</p>
            <p className="text-4xl font-black text-blue-600 tracking-tighter">{formatearCOP(totalVenta)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black sticky top-0 border-b">
              <tr>
                <th className="px-6 py-4">Ítem</th>
                <th className="px-6 py-4 text-center">Cant.</th>
                <th className="px-6 py-4">Unitario</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {detalles.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-800">{item.nombre}</td>
                  <td className="px-6 py-4 text-center"><span className="bg-gray-100 px-3 py-1 rounded-lg font-bold">{item.cantidad}</span></td>
                  <td className="px-6 py-4 text-gray-400">{formatearCOP(item.precio_unitario)}</td>
                  <td className="px-6 py-4 text-right font-black text-gray-900">{formatearCOP(item.cantidad * item.precio_unitario)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CAMBIO */}
      {mostrarVuelto && (
        <div className="fixed inset-0 bg-[#0A1F44]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900">Venta Exitosa</h3>
              <p className="text-gray-500 font-medium">Calculando el cambio para el cliente</p>
            </div>

            <div className="space-y-6 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <div className="flex justify-between items-center text-sm border-b pb-4">
                <span className="text-gray-400 font-black uppercase">A cobrar</span>
                <span className="text-xl font-black text-gray-900">{formatearCOP(totalVenta)}</span>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-blue-600 uppercase block ml-1">Dinero Recibido ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-4 text-gray-400" size={24} />
                  <input
                    type="number" autoFocus
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl text-2xl font-black outline-none focus:border-blue-500 transition-all shadow-sm"
                    value={dineroRecibido} onChange={(e) => manejarDineroRecibido(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="font-black text-gray-400 uppercase text-[10px]">Vuelto</span>
                <span className={`text-4xl font-black tracking-tighter ${cambio < 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {formatearCOP(cambio)}
                </span>
              </div>
            </div>

            <button 
              onClick={finalizarProceso} 
              className="w-full mt-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase"
            >
              Nueva Transacción <ArrowRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentaForm;