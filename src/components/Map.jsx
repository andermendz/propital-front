import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import PropertyForm from './PropertyForm';
import PropertyIcon from './PropertyIcon';

// fix para los iconos de marcador por defecto
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// actualiza la sección de iconos de marcador personalizados en la parte superior del archivo
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

// reemplaza las definiciones de iconos existentes
const customIcon = createCustomIcon('blue');
const newPropertyIcon = createCustomIcon('green');
const selectedPropertyIcon = createCustomIcon('indigo');

// componente para manejar el click en el mapa
function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ latitude: lat, longitude: lng });
    },
  });
  return null;
}

// componente para recentrar el mapa automáticamente
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
  onLocationSelect,
  newPropertyLocation,
}) => {
  const [map, setMap] = useState(null);

  const navigate = useNavigate();
  const defaultCenter = [4.624335, -74.063644]; // bogotá, colombia

  // actualiza handleLocationSelect
  const handleMapClick = (location) => {
    if (!isAddingProperty) return;
    onLocationSelect(location);
  };

  if (mapError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-red-500">error loading map. please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        whenCreated={setMap}
      >
        {/* muestra el mensaje de instrucción cuando está en modo de agregar propiedad */}
        {isAddingProperty && !newPropertyLocation && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-6 py-3 rounded-lg shadow-lg">
            <p className="text-gray-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              haz clic en el mapa para ubicar la nueva propiedad
            </p>
          </div>
        )}

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* centrado de la propiedad seleccionada */}
        {selectedProperty && (
          <RecenterAutomatically
            lat={selectedProperty.latitude}
            lng={selectedProperty.longitude}
          />
        )}

        {/* marcadores de propiedades existentes */}
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
              <div className="p-3 min-w-[280px] max-w-[320px]">
                <div className="relative rounded-lg overflow-hidden shadow-md">
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <PropertyIcon
                      type={property.type}
                      className="w-16 h-16 text-blue-500/50"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-lg">
                      <span className="text-blue-600 font-medium text-sm">
                        {
                          property.type === 'casa' ? 'casa' :
                            property.type === 'apartamento' ? 'apartamento' :
                              property.type === 'oficina' ? 'oficina' :
                                property.type === 'local' ? 'local' :
                                  property.type === 'finca' ? 'finca' :
                                    property.type === 'bodega' ? 'bodega' :
                                      'tipo desconocido'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg">
                      ${property.price?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-2">
                  <h3 className="font-bold text-lg text-gray-900 mb-0.5 line-clamp-1">{property.name}</h3>
                  <p className="text-gray-600 text-sm mb-1 line-clamp-1">{property.address}</p>

                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-700">
                    <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">área</span>
                      <span className="font-medium">{property.area}m²</span>
                    </div>
                    <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">hab</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex flex-col items-center p-1 bg-gray-50 rounded-lg">
                      <span className="text-gray-500">baños</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                  </div>

                  {property.description && (
                    <div className="mt-2 bg-gray-50 p-2 rounded-lg">
                      <p className="text-gray-700 text-xs line-clamp-2">{property.description}</p>
                    </div>
                  )}

                  {property.parkingSpaces > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      {property.parkingSpaces} parqueadero{property.parkingSpaces > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* nuevo marcador de propiedad */}
        {newPropertyLocation && (
          <Marker
            position={[newPropertyLocation.latitude, newPropertyLocation.longitude]}
            icon={newPropertyIcon}
          >
            <Popup className="property-popup">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="font-bold text-lg text-gray-900">nueva propiedad</h3>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-gray-500">latitud</span>
                      <span className="font-medium text-gray-900">
                        {newPropertyLocation.latitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-500">longitud</span>
                      <span className="font-medium text-gray-900">
                        {newPropertyLocation.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  haz clic en otro lugar para actualizar la ubicación
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* controlador de clic en el mapa */}
        <MapClickHandler onLocationSelect={handleMapClick} />
      </MapContainer>
    </div>
  );
};

export default Map;
