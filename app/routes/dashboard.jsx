import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { 
  TrendingUp, 
  PackageSearch, 
  AlertTriangle, 
  ArrowUpRight, 
  ShoppingBag,
  PlusCircle,
  RefreshCcw,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [productosCriticos, setProductosCriticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 1. Petición de Estadísticas (Ventas, Stock Total, Conteo Bajo)
      const resStats = await axios.get('http://127.0.0.1:8000/api/v1/dashboard-stats/', config);

      // 2. Petición de Productos con Stock Bajo
      const resCriticos = await axios.get('http://127.0.0.1:8000/api/v1/productos/?stock_lte=10', config);

      // Mapeo de iconos basado en el ID definido en el Backend
      const iconMap = {
        1: <TrendingUp className="text-green-600" />,     // Ventas del día
        2: <PackageSearch className="text-blue-600" />,   // Valor total inventario
        4: <AlertTriangle className="text-red-600" />,    // Productos stock bajo
      };

      // CORRECCIÓN AQUÍ: Accedemos a resStats.data.stats_cards
      const dataConIconos = (resStats.data.stats_cards || []).map(item => ({
        ...item,
        icon: iconMap[item.id] || <PackageSearch size={20} />
      }));

      setStats(dataConIconos);
      setProductosCriticos(resCriticos.data.slice(0, 5)); 
    } catch (error) {
      console.error("Error cargando StocklyX:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <div className="text-[#0A1F44] font-black animate-pulse text-2xl tracking-tighter">
          SINCRONIZANDO BODEGA...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-black">
      {/* TÍTULO */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 font-medium">Resumen operativo en tiempo real.</p>
        </div>
        <button onClick={fetchDashboardData} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* MÉTRICAS (Basadas en stats_cards del backend) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-gray-50 rounded-2xl">{item.icon}</div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                item.id === 4 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
              }`}>
                {item.change}
              </span>
            </div>
            <div className="mt-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
              <p className="text-3xl font-black text-gray-900 mt-1 tracking-tighter">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TABLA DE STOCK CRÍTICO */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
              <AlertTriangle size={18} className="text-orange-500" />
              Alertas de Inventario Bajo
            </h3>
            <button onClick={() => navigate('/inventario')} className="text-xs font-black text-blue-600 hover:underline flex items-center gap-1">
              VER TODO <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-black border-b border-gray-50">
                  <th className="px-8 py-4">Producto</th>
                  <th className="px-8 py-4 text-center">Stock Actual</th>
                  <th className="px-8 py-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {productosCriticos.map((prod) => (
                  <tr key={prod.id || prod.sku} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-4">
                      <p className="font-bold text-gray-800">{prod.nombre}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{prod.sku}</p>
                    </td>
                    <td className="px-8 py-4 text-center text-red-600 font-black text-lg">
                      {prod.stock}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-full uppercase">
                        Reordenar
                      </span>
                    </td>
                  </tr>
                ))}
                {productosCriticos.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-8 py-10 text-center text-gray-400 italic">
                      No hay alertas de stock bajo actualmente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACCIONES RÁPIDAS */}
        <div className="space-y-4">
          <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-[0.2em] ml-2">Operaciones</h3>
          <button 
            onClick={() => navigate('/ventas')}
            className="w-full flex items-center justify-between bg-[#0A1F44] hover:bg-blue-900 p-8 rounded-[2rem] text-white transition-all shadow-xl shadow-blue-900/20 group"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-white/10 rounded-xl"><ShoppingBag size={28} /></div>
              <div>
                <p className="font-black text-xl">Nueva Venta</p>
                <p className="text-xs text-blue-300">Abrir punto de venta</p>
              </div>
            </div>
            <ArrowUpRight className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button 
            onClick={() => navigate('/registro-producto')}
            className="w-full flex items-center justify-between bg-white hover:bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-[#0A1F44] transition-all group shadow-sm"
          >
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-blue-50 rounded-xl"><PlusCircle size={28} /></div>
              <div>
                <p className="font-black text-xl">Registrar</p>
                <p className="text-xs text-gray-400">Añadir nuevo producto</p>
              </div>
            </div>
            <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;