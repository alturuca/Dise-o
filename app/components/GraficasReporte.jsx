import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar
} from 'recharts';

const GraficasReporte = ({ datosVentas }) => {
  // 1. Verificamos si llegaron datos reales. Si no, usamos un array vacío para no mostrar basura.
  const dataFinal = datosVentas && datosVentas.length > 0 ? datosVentas : [];

  const formatearCOP = (valor) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);

  if (dataFinal.length === 0) {
    return (
      <div className="h-60 flex items-center justify-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
        <p className="text-gray-400 font-medium italic">Esperando datos de ventas para generar gráficas...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      
      {/* TENDENCIA SEMANAL (Usando dataFinal) */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="text-gray-900 font-black mb-6 text-sm uppercase tracking-widest italic">Tendencia Semanal</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dataFinal}> {/* ✅ Datos de la API */}
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(value) => [formatearCOP(value), 'Ventas']} />
              <Area type="monotone" dataKey="ventas" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMPARATIVA (Usando dataFinal) */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h3 className="text-gray-900 font-black mb-6 text-sm uppercase tracking-widest italic">Comparativa de Rendimiento</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataFinal}> {/* ✅ Datos de la API */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => formatearCOP(value)} />
              <Bar dataKey="ventas" fill="#0A1F44" radius={[10, 10, 0, 0]} />
              <Bar dataKey="utilidad" fill="#4caf50" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GraficasReporte;