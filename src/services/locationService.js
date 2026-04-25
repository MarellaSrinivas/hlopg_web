// src/services/locationService.js
import axios from 'axios';

const locationService = {
  // Get all Indian states
  getStates: async () => {
    try {
      // Using a free API for Indian states
      const response = await axios.get('https://countriesnow.space/api/v0.1/countries/states', {
        params: {
          country: 'India'
        }
      });
      
      if (response.data?.data?.states) {
        return response.data.data.states.map(state => state.name);
      }
      return [];
    } catch (error) {
      console.error("Error fetching states:", error);
      return [];
    }
  },

  // Get cities for a specific state
  getCities: async (state) => {
    try {
      const response = await axios.get('https://countriesnow.space/api/v0.1/countries/state/cities', {
        params: {
          country: 'India',
          state: state
        }
      });
      
      if (response.data?.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching cities for ${state}:`, error);
      return [];
    }
  },

  // Get areas for a city (using another API or static data)
  // Note: This API might not have area data, so we'll use a fallback
  getAreas: async (city) => {
    try {
      // You can use this API or maintain a static mapping for popular cities
      // For now, returning common areas as fallback
      const commonAreas = {
        'Hyderabad': ['Ameerpet', 'Gachibowli', 'Madhapur', 'KPHB', 'Hitech City'],
        'Bangalore': ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Marathahalli'],
        'Mumbai': ['Andheri', 'Bandra', 'Powai', 'Thane', 'Dadar'],
        'Delhi': ['Connaught Place', 'Dwarka', 'Rohini', 'Saket', 'Pitampura'],
        'Chennai': ['Adyar', 'Anna Nagar', 'T Nagar', 'Velachery', 'OMR'],
        // Add more cities as needed
      };
      
      return commonAreas[city] || [];
    } catch (error) {
      console.error(`Error fetching areas for ${city}:`, error);
      return [];
    }
  }
};

export default locationService;