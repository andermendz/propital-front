import React, { useState } from 'react';

const PropertyForm = ({ onSubmit, initialData, isEditing, onClose }) => {
  const defaultFormData = {
    name: '',
    description: '',
    type: '',
    price: '',
    area: '',
    latitude: '',
    longitude: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    parkingSpaces: '',
    mainImageUrl: '',
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
    // Convert numeric fields
    const processedData = {
      ...formData,
      price: Number(formData.price) || 0,
      area: Number(formData.area) || 0,
      latitude: Number(formData.latitude) || 0,
      longitude: Number(formData.longitude) || 0,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      parkingSpaces: Number(formData.parkingSpaces) || 0,
      // Ensure image fields have default values
      mainImageUrl: formData.mainImageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(formData.type || 'Property')}`,
      imageUrls: formData.imageUrls || []
    };
    onSubmit(processedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Complete los detalles de la propiedad a continuación.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Ej: Casa moderna en el norte"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select
              name="type"
              value={formData.type || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="oficina">Oficina</option>
              <option value="local">Local</option>
              <option value="finca">Finca</option>
              <option value="bodega">Bodega</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              placeholder="Ej: Calle 123 #45-67"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
              <input
                type="number"
                name="area"
                value={formData.area || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parqueaderos</label>
              <input
                type="number"
                name="parkingSpaces"
                value={formData.parkingSpaces || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Baños</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                placeholder="0"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows="4"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          placeholder="Describe la propiedad..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <span>{isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
