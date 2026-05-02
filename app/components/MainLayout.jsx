import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  PlusCircle, // Para Registro de Producto
  Truck,       // ✅ Nuevo icono para Compras
  BarChart3,   // Para Reportes
  Menu, 
  X, 
  LogOut, 
  ChevronRight, 
  UserPlus,
} from 'lucide-react';
import StocklyXLogo from './StocklyXLogo';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Usuarios', icon: <UserPlus size={20} />, path: '/usuarios' },
    { name: 'Ventas (POS)', icon: <ShoppingCart size={20} />, path: '/ventas' },
    { name: 'Inventario', icon: <Package size={20} />, path: '/inventario' },
    { name: 'Registro Producto', icon: <PlusCircle size={20} />, path: '/productos' },    
    { name: 'Compras', icon: <Truck size={20} />, path: '/compras' }, // ✅ Icono y ruta corregidos
    { name: 'Reportes', icon: <BarChart3 size={20} />, path: '/reportes' },
   
  ];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-black font-sans">
      
      {/* --- ENCABEZADO (HEADER) --- */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="hidden sm:block">
            <StocklyXLogo width={120} height={40} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-none">Alex Tulio</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm">
            AT
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* --- BARRA LATERAL (SIDEBAR) --- */}
        {/* Overlay para móvil */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0A1F44] text-white transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <StocklyXLogo width={120} height={40} />
              <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
            </div>

            <nav className="flex-1 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>

            <button 
              onClick={handleLogout}
              className="mt-auto flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-bold"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* --- CUERPO (MAIN CONTENT) --- */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            <Outlet /> {/* AQUÍ SE CARGARÁN TUS PÁGINAS (Ventas, Inventario, etc.) */}
          </div>
        </main>
      </div>

      {/* --- PIE DE PÁGINA (FOOTER) --- */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
        &copy; 2026 StocklyX - Sistema de Gestión de Inventarios. Colombia.
      </footer>
    </div>
  );
};

export default MainLayout;