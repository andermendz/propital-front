import React, { useState } from 'react';

const PropertyForm = ({ onSubmit, initialData, isEditing, onClose }) => {
  const defaultFormData = {
    name: '',
    description: '',
    type: '',
    price: '',
    area: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    imageUrls: []
  };

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...defaultFormData,
        ...initialData,
      };
    }
    return defaultFormData;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // convierte los campos numéricos
    const processedData = {
      ...formData,
      price: Number(formData.price) || 0,
      area: Number(formData.area) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      parkingSpaces: Number(formData.parkingSpaces) || 0,
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white px-6 py-5 rounded-t-xl border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.172M12 22h4.014m-4.014-4h4.014" />
              </svg>
              editar propiedad
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              nueva propiedad
            </span>
          )}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          complete los detalles de la propiedad a continuación.
        </p>
      </div>

      <div className="px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
          {/* columna izquierda */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="ej: casa moderna en el norte"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">tipo</label>
            <select
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              required
            >
              <option value="">seleccionar tipo</option>
              <option value="casa">casa</option>
              <option value="apartamento">apartamento</option>
              <option value="oficina">oficina</option>
              <option value="local">local</option>
              <option value="finca">finca</option>
              <option value="bodega">bodega</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="ej: calle 123 #45-67"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">precio</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">área (m²)</label>
            <input
              type="number"
              name="area"
              value={formData.area || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="0"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">habitaciones</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="0"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">baños</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="0"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">parqueaderos</label>
            <input
              type="number"
              name="parkingSpaces"
              value={formData.parkingSpaces || ''}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">descripción</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors shadow-sm text-sm"
              placeholder="describe la propiedad..."
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium text-sm"
          >
            cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium text-sm">
            {isEditing ? (
              <>
                <span>guardar cambios</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </>
            ) : (
              <>
                <span>crear propiedad</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
