import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import SearchFilters from '../components/SearchFilters';
import PropertyList from '../components/PropertyList';
import PropertyForm from '../components/PropertyForm';
import Modal from '../components/Modal';
import { getProperties, searchProperties, createProperty, updateProperty, deleteProperty } from '../services/api';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddingProperty, setIsAddingProperty] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [currentPage]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProperties();
      console.log('Properties response:', response);
      
      // Handle different response formats
      let propertiesData = [];
      if (Array.isArray(response)) {
        propertiesData = response;
      } else if (response?.items) {
        propertiesData = response.items;
      } else if (typeof response === 'object') {
        // If it's an object but not in the expected format, try to extract properties
        propertiesData = Object.values(response).filter(item => 
          item && typeof item === 'object' && 'id' in item
        );
      }

      console.log('Processed properties data:', propertiesData);
      setProperties(propertiesData);

    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Error al cargar las propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await searchProperties(filters);
      console.log('Search results:', response);
      
      // Extract properties from the items array in the response
      const propertiesData = response?.items || [];
      setProperties(propertiesData);
      
      // Update total pages if total is provided
      if (response?.total) {
        setTotalPages(Math.ceil(response.total / 10));
      }
    } catch (err) {
      console.error('Error searching properties:', err);
      setError('Error al buscar propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProperty = async (propertyData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Creating property with data:', propertyData);
      const newProperty = await createProperty(propertyData);
      console.log('Created property:', newProperty);
      
      // Add the new property to the list immediately
      setProperties(prev => [newProperty, ...prev]);
      setIsAddingProperty(false);
      
      // Refresh the full list to ensure we have the latest data
      await loadProperties();
    } catch (err) {
      console.error('Error creating property:', err);
      setError('Error al crear la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProperty = async (propertyData) => {
    try {
      setLoading(true);
      setError(null);
      await updateProperty(selectedProperty.id, propertyData);
      setIsModalOpen(false);
      setSelectedProperty(null);
      loadProperties();
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Error al actualizar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      try {
        setLoading(true);
        setError(null);
        await deleteProperty(id);
        loadProperties();
      } catch (err) {
        console.error('Error deleting property:', err);
        setError('Error al eliminar la propiedad');
      } finally {
        setLoading(false);
      }
    }
  };

  const openCreateModal = () => {
    setSelectedProperty(null);
    setIsModalOpen(true);
  };

  const openEditModal = (property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/3 flex flex-col border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <SearchFilters onSearch={handleSearch} />
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-red-500 px-4">
              {error}
            </div>
          ) : properties.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 px-4">
              No se encontraron propiedades
            </div>
          ) : (
            <PropertyList
              properties={properties}
              onEdit={openEditModal}
              onDelete={handleDeleteProperty}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setIsAddingProperty(true)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Nueva Propiedad</span>
          </button>
        </div>
      </div>

      {/* Right Map Section */}
      <div className="flex-1 relative">
        <Map
          properties={properties}
          isAddingProperty={isAddingProperty}
          onPropertyCreate={handleCreateProperty}
        />
      </div>

      {/* Property Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PropertyForm
          onSubmit={selectedProperty ? handleUpdateProperty : handleCreateProperty}
          initialData={selectedProperty}
          isEditing={!!selectedProperty}
        />
      </Modal>
    </div>
  );
};

export default HomePage;
