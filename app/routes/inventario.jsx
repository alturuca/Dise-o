import React, { useState, useEffect } from 'react';
import InventarioTable from '../components/InventarioTable';
import { Package, RefreshCw, FileDown, Search } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/v1/productos/';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Filtrado en tiempo real por Nombre o SKU
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
    p.sku.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER DEL MÓDULO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#0A1F44] text-white rounded-2xl">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Inventario General</h1>
            <p className="text-sm text-gray-500 font-medium">Control de existencias y precios en tiempo real.</p>
          </div>
        </div>

        
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-tighter">
          <span>Total: {productosFiltrados.length} Items</span>
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <InventarioTable
         productos={productosFiltrados} 
         setProductos={setProductos}
         />
      </div>
    </div>
  );
};

export default Inventario;