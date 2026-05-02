import React from 'react';
import { ChevronRight } from 'lucide-react';

const ReporteCard = ({ titulo, valor, color, icon, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Decoración de fondo */}
      <div 
        className="absolute top-0 left-0 w-2 h-full" 
        style={{ backgroundColor: color }}
      />
      
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-opacity-80 transition-colors" style={{ color: color }}>
          {icon}
        </div>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{titulo}</p>
        <p className="text-2xl font-black text-gray-900 mt-1 tracking-tighter">
          {valor || "---"}
        </p>
      </div>
    </div>
  );
};

export default ReporteCard;