import React, { useState } from 'react';

const SearchFilters = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      minPrice: '',
      maxPrice: '',
      minBedrooms: '',
      minBathrooms: '',
    });
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros de búsqueda</h3>
        <p className="mt-1 text-sm text-gray-500">Encuentra la propiedad perfecta</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
          >
            <option value="">Todos</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="oficina">Oficina</option>
            <option value="local">Local</option>
            <option value="finca">Finca</option>
            <option value="bodega">Bodega</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio máx.</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              placeholder="Precio máximo"
            />
          </div>
        </div>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Habitaciones mín.</label>
            <input
              type="number"
              name="minBedrooms"
              value={filters.minBedrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              placeholder="Mínimo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Baños mín.</label>
            <input
              type="number"
              name="minBathrooms"
              value={filters.minBathrooms}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              placeholder="Mínimo"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Ocultar filtros avanzados' : 'Mostrar filtros avanzados'}
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Limpiar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <span>Buscar</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
