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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) setShowSidebar(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadProperties();
  }, [currentPage]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProperties();
      console.log('Properties response:', response);
      
      let propertiesData = [];
      if (Array.isArray(response)) {
        propertiesData = response;
      } else if (response?.items) {
        propertiesData = response.items;
      } else if (typeof response === 'object') {
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
      const propertiesData = response?.items || response || [];
      setProperties(propertiesData);
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
      const newProperty = await createProperty(propertyData);
      setProperties(prev => [newProperty, ...prev]);
      setIsAddingProperty(false);
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'map' : 'list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {isMobileView && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <h1 className="text-2xl font-bold text-gray-900 ml-2">Propital</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {isMobileView && (
                <button
                  onClick={toggleViewMode}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  {viewMode === 'list' ? 'Ver Mapa' : 'Ver Lista'}
                </button>
              )}
              <button
                onClick={() => setIsAddingProperty(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Nueva Propiedad
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 h-screen">
        <div className="h-full flex">
          {/* Sidebar */}
          {(!isMobileView || (isMobileView && showSidebar && viewMode === 'list')) && (
            <div className={`${isMobileView ? 'w-full' : 'w-1/3 min-w-[400px]'} bg-white shadow-lg flex flex-col`}>
              <div className="p-4 border-b border-gray-200">
                <SearchFilters onSearch={handleSearch} />
              </div>

              <div className="flex-1 overflow-hidden">
                {error && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <PropertyList
                    properties={properties}
                    onPropertySelect={setSelectedProperty}
                    onEditProperty={(prop) => {
                      setSelectedProperty(prop);
                      setIsModalOpen(true);
                    }}
                    onDeleteProperty={handleDeleteProperty}
                  />
                )}
              </div>
            </div>
          )}

          {/* Map */}
          {(!isMobileView || (isMobileView && viewMode === 'map')) && (
            <div className={`${isMobileView ? 'w-full' : 'flex-1'} relative`}>
              <Map
                properties={properties}
                isAddingProperty={isAddingProperty}
                onPropertyCreate={handleCreateProperty}
                selectedProperty={selectedProperty}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <PropertyForm
            initialData={selectedProperty}
            onSubmit={selectedProperty ? handleUpdateProperty : handleCreateProperty}
            isEditing={!!selectedProperty}
          />
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
