import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import StocklyXLogo from '../components/StocklyXLogo.jsx';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!usuario || !contraseña) {
      setMessage('Por favor, completa todos los campos.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario, password: contraseña }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh);
        setMessage(`¡Bienvenido! Redirigiendo...`);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMessage(data.detail || 'Credenciales incorrectas.');
      }
    } catch (error) {
      setMessage('Error de conexión. Verifica tu servidor Django.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 font-sans">
      
      {/* SECCIÓN IZQUIERDA: FORMULARIO (Ocupa todo en móvil, mitad en desktop) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 md:p-20">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          
          {/* LOGO Y BIENVENIDA */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start mb-6">
              <StocklyXLogo width={220} height={70} />
            </div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">¡Hola de nuevo!</h2>
            <p className="text-gray-500 mt-2 font-medium">Ingresa tus credenciales para gestionar StocklyX</p>
          </div>

          {/* FORMULARIO */}
          <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              {/* Input Usuario */}
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  required
                />
              </div>

              {/* Input Password */}
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Contraseña"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                  value={contraseña}
                  onChange={(e) => setContraseña(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* MENSAJE DE ERROR/ÉXITO */}
            {message && (
              <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-bold animate-in zoom-in duration-300 ${
                message.includes('Bienvenido') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                <AlertCircle size={18} />
                {message}
              </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-4 bg-[#0A1F44] hover:bg-blue-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:bg-gray-400"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn size={22} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 font-medium">
            ¿Olvidaste tu contraseña? Contacta al administrador.
          </p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: IMAGEN (Oculta en móviles < 1024px) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-blue-800">
        <img 
          src="/Bodega.png" 
          alt="Bodega eficiente" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-100"
        />
        <div className="relative z-10 flex flex-col justify-end p-20 text-white w-full h-full bg-gradient-to-t from-blue-900/80 to-transparent">
          <div className="max-w-md">
            <h3 className="text-4xl font-black mb-4 leading-tight">Gestión eficiente, crecimiento constante.</h3>
            <p className="text-lg text-blue-100 font-medium opacity-90">
              La plataforma integral para el control de inventarios y ventas en tiempo real.
            </p>
            <div className="mt-8 flex gap-2">
              <div className="h-1.5 w-12 bg-white rounded-full"></div>
              <div className="h-1.5 w-4 bg-white/30 rounded-full"></div>
              <div className="h-1.5 w-4 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;