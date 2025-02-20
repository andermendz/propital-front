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

// Custom marker icons
const customIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const newPropertyIcon = new L.Icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'new-property-marker'
});

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

const Map = ({ properties, isAddingProperty = false, onPropertyCreate }) => {
  const navigate = useNavigate();
  const defaultCenter = [4.6097, -74.0817]; // Bogotá coordinates as default
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapError, setMapError] = useState(false);
  const [newPropertyLocation, setNewPropertyLocation] = useState(null);
  const [showPropertyForm, setShowPropertyForm] = useState(false);

  // Error boundary for map loading
  useEffect(() => {
    const handleMapError = () => setMapError(true);
    window.addEventListener('error', handleMapError);
    return () => window.removeEventListener('error', handleMapError);
  }, []);

  const handleLocationSelect = (location) => {
    if (isAddingProperty) {
      setNewPropertyLocation(location);
      setShowPropertyForm(true);
    }
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
    <div className="absolute inset-0">
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
            icon={customIcon}
            eventHandlers={{
              click: () => setSelectedProperty(property),
            }}
          >
            <Popup className="property-popup">
              <div className="p-3 min-w-[250px] max-w-[300px]">
                <div className="relative mb-3">
                  <PropertyIcon 
                    type={property.type} 
                    className="w-full h-32 text-blue-600"
                  />
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm">
                    ${property.price?.toLocaleString()}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{property.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                <div className="flex gap-3 mb-3 text-sm text-gray-700">
                  <span className="flex items-center">
                    <i className="fas fa-bed mr-1"></i> {property.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-bath mr-1"></i> {property.bathrooms}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-ruler-combined mr-1"></i> {property.area}m²
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <span>Ver detalles</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
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
              <div className="p-3">
                <h3 className="font-bold text-lg mb-2">Nueva Propiedad</h3>
                <p className="text-sm text-gray-600">
                  Lat: {newPropertyLocation.latitude.toFixed(6)}<br />
                  Lng: {newPropertyLocation.longitude.toFixed(6)}
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
