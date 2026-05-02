import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserPlus, Mail, Shield, Save, User, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const UsuariosForm = ({ usuarioAEditar, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    rol: 'vendedor'
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // ✅ Efecto para cargar datos si entramos en modo EDICIÓN
  useEffect(() => {
    if (usuarioAEditar) {
      setFormData({
        username: usuarioAEditar.username || '',
        first_name: usuarioAEditar.first_name || '',
        last_name: usuarioAEditar.last_name || '',
        email: usuarioAEditar.email || '',
        password: '', // 💡 La contraseña siempre se deja vacía por seguridad al editar
        rol: usuarioAEditar.rol || 'vendedor'
      });
    } else {
      // Si no hay usuario a editar, reseteamos el formulario
      setFormData({ username: '', first_name: '', last_name: '', email: '', password: '', rol: 'vendedor' });
    }
  }, [usuarioAEditar]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const isEditing = !!usuarioAEditar;
    
    // ✅ Determinamos URL y Método dinámicamente
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/v1/usuarios/${usuarioAEditar.id}/` 
      : 'http://127.0.0.1:8000/api/v1/usuarios/';
    
    const method = isEditing ? 'patch' : 'post';

    // 💡 Si estamos editando y la contraseña está vacía, no la enviamos para no sobreescribirla con nada
    const dataToSend = { ...formData };
    if (isEditing && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const response = await axios({
        method: method,
        url: url,
        data: dataToSend,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        setStatus({ 
          type: 'success', 
          message: isEditing ? '¡Usuario actualizado!' : '¡Usuario creado exitosamente!' 
        });
        
        // Esperamos un poco para que el usuario vea el éxito antes de cerrar/limpiar
        setTimeout(() => {
          onSuccess(); 
        }, 1500);
      }
    } catch (error) {
      console.error("Detalle del error:", error.response?.data);
      const serverErrors = error.response?.data;
      let msg = 'Error en la solicitud.';

      if (serverErrors && typeof serverErrors === 'object') {
        msg = Object.entries(serverErrors)
          .map(([field, errors]) => {
            const fieldMsg = Array.isArray(errors) ? errors.join(', ') : errors;
            return `${field}: ${fieldMsg}`;
          })
          .join(' | ');
      }
      setStatus({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 w-full shadow-none">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-blue-100 p-3 rounded-2xl text-[#0A1F44]">
          {usuarioAEditar ? <Shield size={28} /> : <UserPlus size={28} />}
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0A1F44]">
            {usuarioAEditar ? 'Editar Usuario' : 'Registrar Usuario'}
          </h2>
          <p className="text-gray-500 text-sm">
            {usuarioAEditar ? `Modificando cuenta de ${usuarioAEditar.username}` : 'Crea nuevas cuentas para el personal'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status.message && (
          <div className={`flex items-center gap-2 p-4 rounded-2xl text-sm font-bold ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nombre</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Apellido</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">
            Contraseña {usuarioAEditar && <span className="text-blue-500 font-normal lowercase">(dejar en blanco para no cambiar)</span>}
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required={!usuarioAEditar}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Rol</label>
          <div className="relative">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none"
            >
              <option value="vendedor">Vendedor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A1F44] hover:bg-blue-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-gray-400 shadow-lg mt-6"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <Save size={20} />
              {usuarioAEditar ? 'Guardar Cambios' : 'Crear Usuario Ahora'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UsuariosForm;