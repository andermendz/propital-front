import React, { useState } from 'react';

const PropertyForm = ({ onSubmit, initialData, isEditing }) => {
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
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Propiedad' : 'Nueva Propiedad'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            name="type"
            value={formData.type || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Seleccionar tipo</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="oficina">Oficina</option>
            <option value="local">Local</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Área (m²)</label>
          <input
            type="number"
            name="area"
            value={formData.area || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Latitud</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            step="any"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Longitud</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            step="any"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Habitaciones</label>
          <input
            type="number"
            name="bedrooms"
            value={formData.bedrooms || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Baños</label>
          <input
            type="number"
            name="bathrooms"
            value={formData.bathrooms || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Parqueaderos</label>
          <input
            type="number"
            name="parkingSpaces"
            value={formData.parkingSpaces || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;
