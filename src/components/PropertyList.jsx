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
      className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPropertySelect?.(property)}
    >
      <div className="p-4">
        {/* Header with Type Badge and Actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </div>
          
          <div className={`flex gap-2 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditProperty?.(property);
              }}
              className="p-2 bg-gray-100 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
              title="Editar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProperty?.(property.id);
              }}
              className="p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition-colors"
              title="Eliminar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Property Icon */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <PropertyIcon type={property.type} className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {property.name}
            </h3>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(property.price)}
            </div>
          </div>
        </div>

        {/* Address */}
        <p className="text-sm text-gray-600 mb-4 truncate">
          {property.address}
        </p>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.area} m²
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {property.bedrooms} hab
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {property.bathrooms} baños
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
