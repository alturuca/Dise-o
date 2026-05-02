import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Pencil, Trash2, Users } from 'lucide-react';
import UsuariosForm from '../components/UsuariosForm';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función segura para obtener el token solo en el cliente
  const getAuthHeader = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('access_token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    return {};
  };

  // --- READ: Obtener usuarios ---
  const fetchUsuarios = async () => {
    try {
      const headers = getAuthHeader();
      if (!headers.Authorization) return;

      const response = await axios.get('http://127.0.0.1:8000/api/v1/usuarios/', { headers });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // --- DELETE: Eliminar usuario ---
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/usuarios/${id}/`, {
          headers: getAuthHeader()
        });
        fetchUsuarios(); // Refrescar la lista
      } catch (error) {
        alert("Error al intentar eliminar el usuario. Verifique sus permisos.");
      }
    }
  };

  // --- UPDATE: Iniciar edición ---
  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  // Callback para cuando el formulario termine con éxito
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsuarios();
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0A1F44] flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 mt-1">Administra el personal y permisos de StocklyX</p>
        </div>
        
        <button 
          onClick={() => { setEditingUser(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
        >
          <UserPlus size={20} /> Nuevo Usuario
        </button>
      </div>

      {/* Tabla Principal */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Identificación / Username</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">Rol de Sistema</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">Cargando datos...</td></tr>
              ) : usuarios.length > 0 ? (
                usuarios.map(user => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0A1F44]">{user.username}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        user.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.rol || 'Vendedor'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                          title="Editar usuario"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-10 text-gray-400">No se encontraron usuarios registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay del Formulario (Modal) */}
      {showForm && (
        <div className="fixed inset-0 bg-[#0A1F44]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[2.5rem] p-2 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                ✕
              </button>
              <UsuariosForm 
                usuarioAEditar={editingUser} 
                onSuccess={handleFormSuccess} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}