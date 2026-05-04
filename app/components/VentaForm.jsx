import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Plus, ShoppingCart, User, Package, 
  DollarSign, CheckCircle, Calculator, ArrowRight, X
} from 'lucide-react';

const PRODUCTOS_API = 'http://127.0.0.1:8000/api/v1/productos/';
const FACTURAS_API = 'http://127.0.0.1:8000/api/v1/facturas/';

const VentaForm = ({ onGuardar }) => {
  const [busqueda, setBusqueda] = useState(''); // Estado para SKU o Nombre
  const [sugerencias, setSugerencias] = useState([]); // Lista de resultados
  const [productoActual, setProductoActual] = useState(null);
  const [cliente, setCliente] = useState('');
  const [cantidad, setCantidad] = useState('1'); 
  const [detalles, setDetalles] = useState([]);
  const [mostrarVuelto, setMostrarVuelto] = useState(false);
  const [dineroRecibido, setDineroRecibido] = useState('');
  const [cambio, setCambio] = useState(0);

  // --- BUSQUEDA DINÁMICA ---
  useEffect(() => {
    const buscarSugerencias = async () => {
      if (busqueda.length < 2) {
        setSugerencias([]);
        return;
      }

      const token = localStorage.getItem('access_token');
      try {
        // Buscamos usando el query param ?search= (estándar de DRF)
        const res = await axios.get(`${PRODUCTOS_API}?search=${busqueda}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSugerencias(res.data.results || res.data); // Maneja paginación o lista simple
      } catch (error) {
        console.error("Error buscando productos:", error);
      }
    };

    const timeoutId = setTimeout(buscarSugerencias, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  const seleccionarProducto = (prod) => {
    setProductoActual(prod);
    setBusqueda(prod.nombre);
    setSugerencias([]);
  };

  const manejarDineroRecibido = (valor) => {
    setDineroRecibido(valor);
    const recibido = parseFloat(valor) || 0;
    setCambio(recibido - totalVenta);
  };

  const finalizarProceso = () => {
    if (onGuardar) {
      onGuardar({ cliente, detalles });
    }
    setMostrarVuelto(false);
    setCliente('');
    setDetalles([]);
    setDineroRecibido('');
    setCambio(0);
    setBusqueda('');
  };

  const agregarProducto = () => {
    if (!productoActual) return;
    const cantidadInt = Math.floor(Number(cantidad));

    if (isNaN(cantidadInt) || cantidadInt <= 0) {
      alert('Cantidad inválida');
      return;
    }

    if (productoActual.stock < cantidadInt) {
      alert(`Solo quedan ${productoActual.stock} unidades.`);
      return;
    }

    const detalle = {
      nombre: productoActual.nombre,
      producto: productoActual.sku,
      cantidad: cantidadInt,
      precio_unitario: parseFloat(productoActual.precio_venta),
    };

    setDetalles([detalle, ...detalles]);

    // Actualización de stock opcional
    const token = localStorage.getItem('access_token');
    axios.patch(`${PRODUCTOS_API}${productoActual.sku}/`, {
      stock: productoActual.stock - cantidadInt,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(err => console.error("Error stock:", err));

    setBusqueda('');
    setProductoActual(null);
    setCantidad('1');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token || !cliente || detalles.length === 0) {
      alert("Faltan datos");
      return;
    }

    try {
      await axios.post(FACTURAS_API, { cliente, detalles }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMostrarVuelto(true);
    } catch (error) {
      alert('Error en el servidor.');
    }
  };

  const totalVenta = detalles.reduce((acc, item) => acc + item.cantidad * item.precio_unitario, 0);
  const formatearCOP = (valor) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

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

            <div className="relative">
              <div className="relative">
                <Package className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  type="text" 
                  placeholder="Buscar por Nombre o SKU..." 
                  value={busqueda} 
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                {busqueda && (
                  <button onClick={() => {setBusqueda(''); setProductoActual(null);}} className="absolute right-3 top-3 text-gray-400 hover:text-red-500">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* LISTA DE SUGERENCIAS */}
              {sugerencias.length > 0 && !productoActual && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-2xl shadow-2xl max-h-60 overflow-auto">
                  {sugerencias.map((p) => (
                    <div 
                      key={p.sku} 
                      onClick={() => seleccionarProducto(p)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b last:border-0 flex justify-between items-center transition-colors"
                    >
                      <div>
                        <p className="text-xs font-black text-gray-900 uppercase">{p.nombre}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-blue-600">{formatearCOP(p.precio_venta)}</p>
                        <p className="text-[10px] font-bold text-gray-400">STOCK: {p.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {productoActual && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in zoom-in duration-300 space-y-4">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-blue-900 text-xs uppercase">{productoActual.nombre}</p>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg text-white ${productoActual.stock < 5 ? 'bg-red-500' : 'bg-blue-600'}`}>
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

      {/* PANEL DERECHO: DETALLE (Se mantiene igual) */}
      <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[450px]">
        {/* ... (resto del código igual) ... */}
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

      {/* MODAL DE CAMBIO (Se mantiene igual) */}
      {mostrarVuelto && (
        // ... (resto del modal igual) ...
        <div className="fixed inset-0 bg-[#0A1F44]/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-3xl font-black text-gray-900">Venta Exitosa</h3>
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