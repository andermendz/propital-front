import axios from 'axios';

// The API doesn't have /api prefix in the URL
const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log request and response for debugging
api.interceptors.request.use(request => {
  console.log('Request:', {
    url: request.url,
    method: request.method,
    data: request.data,
    params: request.params
  });
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getProperties = async (page = 1, limit = 10) => {
  try {
    // Remove the page and limit params for now as they might not be implemented in the backend
    const response = await api.get('/properties');
    console.log('Properties response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const searchProperties = async (filters) => {
  try {
    const response = await api.get('/properties/search', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

export const createProperty = async (propertyData) => {
  try {
    console.log('Creating property with data:', propertyData);
    
    // Ensure numeric fields are properly formatted
    const processedData = {
      ...propertyData,
      price: Number(propertyData.price),
      area: Number(propertyData.area),
      bedrooms: Number(propertyData.bedrooms),
      bathrooms: Number(propertyData.bathrooms),
      parkingSpaces: Number(propertyData.parkingSpaces),
      latitude: Number(propertyData.latitude),
      longitude: Number(propertyData.longitude),
      // Ensure image fields have default values
      mainImageUrl: propertyData.mainImageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(propertyData.type || 'Property')}`,
      imageUrls: propertyData.imageUrls || []
    };

    console.log('Processed property data:', processedData);
    
    const response = await api.post('/properties', processedData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

export const updateProperty = async (id, propertyData) => {
  try {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  } catch (error) {
    console.error('Error updating property:', error);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    await api.delete(`/properties/${id}`);
  } catch (error) {
    console.error('Error deleting property:', error);
    throw error;
  }
};
