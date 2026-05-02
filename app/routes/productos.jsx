import React, { useState, useEffect } from 'react';
import ProductForm from '../components/ProductForm';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { Package, Edit3, Trash2, Search, Box } from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api/v1/productos/';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoActual, setProductoActual] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleGuardar = async (producto) => {
    const token = localStorage.getItem('access_token');
    try {
      if (modoEdicion) {
        await axios.put(`${API_URL}${producto.sku}/`, producto, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(API_URL, producto, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      cancelarEdicion();
      fetchProductos();
    } catch (error) {
      alert('Error al guardar: ' + JSON.stringify(error.response?.data));
    }
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setProductoActual(null);
  };

  const handleEliminar = async (sku) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de la base de datos?')) {
      try {
        await axios.delete(`${API_URL}${sku}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProductos();
      } catch (error) {
        alert('No se puede eliminar un producto con historial de ventas.');
      }
    }
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-black">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
            <Box size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Maestro de Productos</h1>
            <p className="text-sm text-gray-500 font-medium tracking-tight">Crea y edita los artículos de tu catálogo.</p>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar producto..."
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FORMULARIO (4 columnas) */}
        <div className="lg:col-span-4 sticky top-4">
          <ProductForm
            onGuardar={handleGuardar}
            producto={productoActual}
            modoEdicion={modoEdicion}
            onCancelar={cancelarEdicion}
          />
        </div>

        {/* TABLA (8 columnas) */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 tracking-widest">SKU</th>
                <th className="px-6 py-4 tracking-widest">Nombre / Descripción</th>
                <th className="px-6 py-4 tracking-widest text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productosFiltrados.map((p) => (
                <tr key={p.sku} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[11px] bg-gray-100 px-2 py-1 rounded-lg text-gray-600 font-bold">
                      {p.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{p.nombre}</p>
                    <p className="text-[11px] text-gray-400 italic line-clamp-1">{p.descripcion}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setProductoActual(p); setModoEdicion(true); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => handleEliminar(p.sku)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {productosFiltrados.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-medium italic">
              No se encontraron productos para mostrar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Productos;