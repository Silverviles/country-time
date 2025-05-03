/**
 * Service for interacting with the REST Countries API
 * https://restcountries.com/
 */

const BASE_URL = 'https://restcountries.com/v3.1';

/**
 * Get all countries
 * @returns {Promise<Array>} Array of country objects
 */
export const getAllCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/all`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

/**
 * Search countries by name
 * @param {string} name - Country name to search for
 * @returns {Promise<Array>} Array of matching country objects
 */
export const getCountryByName = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/name/${name}`);
    if (!response.ok) {
      if (response.status === 404) {
        return []; // Return empty array for no results
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error searching for country "${name}":`, error);
    throw error;
  }
};

/**
 * Get countries by region
 * @param {string} region - Region to filter by (Africa, Americas, Asia, Europe, Oceania)
 * @returns {Promise<Array>} Array of country objects in the specified region
 */
export const getCountriesByRegion = async (region) => {
  try {
    const response = await fetch(`${BASE_URL}/region/${region}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching countries in region "${region}":`, error);
    throw error;
  }
};

/**
 * Get country details by country code
 * @param {string} code - Country code (alpha-2 or alpha-3)
 * @returns {Promise<Object>} Country object with detailed information
 */
export const getCountryByCode = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/alpha/${code}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching country with code "${code}":`, error);
    throw error;
  }
};