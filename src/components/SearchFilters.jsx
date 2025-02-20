import React, { useState } from 'react';

const SearchFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    minArea: '',
    maxArea: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {});
    onSearch(validFilters);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow-lg rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        >
          <option value="">Tipo de propiedad</option>
          <option value="casa">Casa</option>
          <option value="apartamento">Apartamento</option>
          <option value="oficina">Oficina</option>
        </select>

        <input
          type="number"
          name="minPrice"
          placeholder="Precio mínimo"
          value={filters.minPrice}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Precio máximo"
          value={filters.maxPrice}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />

        <input
          type="number"
          name="minArea"
          placeholder="Área mínima"
          value={filters.minArea}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />

        <input
          type="number"
          name="maxArea"
          placeholder="Área máxima"
          value={filters.maxArea}
          onChange={handleChange}
          className="p-2 border rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
};

export default SearchFilters;
