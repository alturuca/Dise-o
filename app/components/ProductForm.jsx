import React, { useState, useEffect } from 'react';
import { Tag, Package, FileText, Save, XCircle, RefreshCcw } from 'lucide-react';

const ProductForm = ({ onGuardar, producto, modoEdicion, onCancelar }) => {
  const [sku, setSku] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (modoEdicion && producto) {
      setSku(producto.sku);
      setNombre(producto.nombre);
      setDescripcion(producto.descripcion);
    } else {
      resetForm();
    }
  }, [producto, modoEdicion]);

  const resetForm = () => {
    setSku('');
    setNombre('');
    setDescripcion('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!sku || !nombre || !descripcion) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const datosProducto = {
      sku: sku.trim().toUpperCase(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio_venta: 0,
      precio_compra: 0,
      stock: 0
    };

    onGuardar(datosProducto);
    if (!modoEdicion) resetForm();
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          {modoEdicion ? <RefreshCcw size={20} /> : <Save size={20} />}
        </div>
        <h3 className="text-xl font-black text-gray-900">
          {modoEdicion ? 'Actualizar Información' : 'Registrar Nuevo Producto'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* SKU */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Identificador SKU</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm disabled:opacity-50"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="Ej: ACE-10W40"
              disabled={modoEdicion}
            />
          </div>
        </div>

        {/* NOMBRE */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
          <div className="relative">
            <Package className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Aceite Motor Premium"
            />
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descripción Detallada</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Aceite sintético de alto rendimiento..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 py-4 bg-[#0A1F44] hover:bg-blue-900 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
          >
            {modoEdicion ? 'GUARDAR CAMBIOS' : 'REGISTRAR PRODUCTO'}
          </button>
          
          {modoEdicion && (
            <button
              type="button"
              onClick={onCancelar}
              className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-black transition-all"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductForm;