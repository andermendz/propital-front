import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';
import PropertyIcon from './PropertyIcon';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Update the custom marker icons section at the top of the file
const createCustomIcon = (color = 'blue') => new L.DivIcon({
  className: '',
  html: `
    <div class="relative">
      <div class="absolute -translate-x-1/2 -translate-y-full">
        <div class="bg-white p-2 rounded-full shadow-lg">
          <div class="bg-${color}-500 w-4 h-4 rounded-full"></div>
        </div>
        <div class="w-2 h-2 bg-${color}-500 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 0],
});

// Replace the existing icon definitions
const customIcon = createCustomIcon('blue');
const newPropertyIcon = createCustomIcon('green');
const selectedPropertyIcon = createCustomIcon('indigo');

// Map click handler component
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

// Map recenter component
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const Map = ({
  properties,
  isAddingProperty = false,
  onPropertyCreate,
  selectedProperty,
  mapError,
  setSelectedProperty,
}) => {
  const [map, setMap] = useState(null);
  const [newPropertyLocation, setNewPropertyLocation] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  const navigate = useNavigate();

  const defaultCenter = [4.624335, -74.063644]; // Bogotá, Colombia

  const handleLocationSelect = (location) => {
    setNewPropertyLocation(location);
    setShowPropertyForm(true);
  };

  const handleFormSubmit = (formData) => {
    // Debug log
    console.log('Form data before submission:', {
      formData,
      location: newPropertyLocation
    });

    if (onPropertyCreate) {
      const propertyData = {
        ...formData,
        latitude: Number(newPropertyLocation.latitude),
        longitude: Number(newPropertyLocation.longitude),
        // Ensure all required fields are present and properly formatted
        price: Number(formData.price) || 0,
        area: Number(formData.area) || 0,
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        parkingSpaces: Number(formData.parkingSpaces) || 0,
        type: formData.type || 'casa', // default type if not specified
        name: formData.name || 'Nueva Propiedad', // default name if not specified
        description: formData.description || '', // empty string if not specified
        address: formData.address || 'Dirección no especificada', // default address if not specified
        // Add default image fields
        mainImageUrl: formData.mainImageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(formData.type || 'Property')}`,
        imageUrls: formData.imageUrls || []
      };

      // Debug log
      console.log('Property data being sent to API:', propertyData);

      onPropertyCreate(propertyData);
    }
    setShowPropertyForm(false);
    setNewPropertyLocation(null);
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">Error loading map. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Map click handler for new property */}
        {isAddingProperty && <MapClickHandler onLocationSelect={handleLocationSelect} />}

        {/* Selected property centering */}
        {selectedProperty && (
          <RecenterAutomatically
            lat={selectedProperty.latitude}
            lng={selectedProperty.longitude}
          />
        )}

        {/* Existing properties markers */}
        {properties?.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={property.id === selectedProperty?.id ? selectedPropertyIcon : customIcon}
            eventHandlers={{
              click: () => setSelectedProperty(property),
            }}
          >
            <Popup className="property-popup">
              <div className="p-4 min-w-[300px] max-w-[400px]">
                <div className="relative mb-4">
                  <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                    <PropertyIcon 
                      type={property.type} 
                      className="w-20 h-20 text-blue-500/50"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
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
                  <div className="absolute top-2 right-2">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ${property.price?.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-4">{property.address}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Área</span>
                    <span className="font-semibold text-gray-900">{property.area}m²</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Habitaciones</span>
                    <span className="font-semibold text-gray-900">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-sm">Baños</span>
                    <span className="font-semibold text-gray-900">{property.bathrooms}</span>
                  </div>
                </div>
                
                {property.description && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-gray-700 text-sm line-clamp-3">{property.description}</p>
                  </div>
                )}

                {property.parkingSpaces > 0 && (
                  <div className="text-sm text-gray-600">
                    {property.parkingSpaces} parqueadero{property.parkingSpaces > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* New property marker */}
        {newPropertyLocation && (
          <Marker
            position={[newPropertyLocation.latitude, newPropertyLocation.longitude]}
            icon={newPropertyIcon}
          >
            <Popup className="property-popup">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-lg text-gray-900">Nueva Propiedad</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-500">Latitud</span>
                      <span className="font-medium text-gray-900">
                        {newPropertyLocation.latitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">Longitud</span>
                      <span className="font-medium text-gray-900">
                        {newPropertyLocation.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Haz clic en otro lugar para actualizar la ubicación
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <PropertyForm
              onSubmit={handleFormSubmit}
              initialData={{
                latitude: newPropertyLocation.latitude,
                longitude: newPropertyLocation.longitude,
              }}
              onClose={() => {
                setShowPropertyForm(false);
                setNewPropertyLocation(null);
              }}
            />
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPropertyForm(false);
                  setNewPropertyLocation(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
