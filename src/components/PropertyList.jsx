import React, { useState } from 'react';
import PropertyIcon from './PropertyIcon';

const PropertyCard = ({ property, onPropertySelect, onEditProperty, onDeleteProperty }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPropertySelect?.(property)}
    >
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg">
              <span className="text-blue-600 font-medium">
                {
                  property.type === 'casa' ? 'Casa' :
                  property.type === 'apartamento' ? 'Apartamento' :
                  property.type === 'oficina' ? 'Oficina' :
                  property.type === 'local' ? 'Local' :
                  property.type === 'finca' ? 'Finca' :
                  property.type === 'bodega' ? 'Bodega' :
                  'Tipo desconocido'
                }
              </span>
            </div>
          </div>
          <PropertyIcon type={property.type} className="w-24 h-24 text-blue-500/50" />
        </div>
        
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditProperty?.(property);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-blue-500 hover:text-white transition-colors shadow-lg"
            title="Editar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProperty?.(property.id);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.name}
          </h3>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {formatPrice(property.price)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-1">{property.address}</p>

        <div className="grid grid-cols-3 gap-2 text-sm text-gray-700">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Área</span>
            <span className="font-medium">{property.area}m²</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Hab</span>
            <span className="font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Baños</span>
            <span className="font-medium">{property.bathrooms}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyList = ({ properties, onPropertySelect, onEditProperty, onDeleteProperty }) => {
  return (
    <div className="overflow-y-auto h-full">
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties?.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onPropertySelect={onPropertySelect}
            onEditProperty={onEditProperty}
            onDeleteProperty={onDeleteProperty}
          />
        ))}
        {(!properties || properties.length === 0) && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-xl font-medium">No hay propiedades</p>
            <p className="text-sm mt-2">Intenta ajustar los filtros o crear una nueva propiedad</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
