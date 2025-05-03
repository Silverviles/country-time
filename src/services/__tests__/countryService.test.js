import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getAllCountries, 
  getCountryByName, 
  getCountriesByRegion, 
  getCountryByCode 
} from '../countryService';

// Sample country data for testing
const mockCountries = [
  {
    name: { common: 'United States', official: 'United States of America' },
    cca3: 'USA',
    flags: { png: 'usa-flag.png', svg: 'usa-flag.svg' },
    capital: ['Washington, D.C.'],
    region: 'Americas',
    population: 331002651,
  },
  {
    name: { common: 'Canada', official: 'Canada' },
    cca3: 'CAN',
    flags: { png: 'canada-flag.png', svg: 'canada-flag.svg' },
    capital: ['Ottawa'],
    region: 'Americas',
    population: 38005238,
  },
];

describe('countryService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock the fetch function
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('getAllCountries', () => {
    it('fetches all countries from the API', async () => {
      // Mock successful response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCountries,
      });

      const result = await getAllCountries();

      // Check that fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/all');
      
      // Check that the function returns the expected data
      expect(result).toEqual(mockCountries);
    });

    it('throws an error when the API request fails', async () => {
      // Mock failed response
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Mock console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Check that the function throws an error
      await expect(getAllCountries()).rejects.toThrow('HTTP error! Status: 500');

      // Check that console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching all countries:',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalConsoleError;
    });

    it('throws an error when fetch throws an error', async () => {
      // Mock fetch throwing an error
      const fetchError = new Error('Network error');
      fetch.mockRejectedValue(fetchError);

      // Mock console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Check that the function throws the same error
      await expect(getAllCountries()).rejects.toThrow(fetchError);

      // Check that console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching all countries:',
        fetchError
      );

      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('getCountryByName', () => {
    it('fetches countries by name from the API', async () => {
      // Mock successful response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => [mockCountries[0]],
      });

      const result = await getCountryByName('United');

      // Check that fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/name/United');
      
      // Check that the function returns the expected data
      expect(result).toEqual([mockCountries[0]]);
    });

    it('returns an empty array when no countries are found', async () => {
      // Mock 404 response (no countries found)
      fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await getCountryByName('NonExistentCountry');

      // Check that the function returns an empty array
      expect(result).toEqual([]);
    });

    it('throws an error when the API request fails with a non-404 status', async () => {
      // Mock failed response
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Mock console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Check that the function throws an error
      await expect(getCountryByName('United')).rejects.toThrow('HTTP error! Status: 500');

      // Check that console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error searching for country "United":',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('getCountriesByRegion', () => {
    it('fetches countries by region from the API', async () => {
      // Mock successful response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockCountries,
      });

      const result = await getCountriesByRegion('Americas');

      // Check that fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/region/Americas');
      
      // Check that the function returns the expected data
      expect(result).toEqual(mockCountries);
    });

    it('throws an error when the API request fails', async () => {
      // Mock failed response
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Mock console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Check that the function throws an error
      await expect(getCountriesByRegion('Americas')).rejects.toThrow('HTTP error! Status: 500');

      // Check that console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching countries in region "Americas":',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalConsoleError;
    });
  });

  describe('getCountryByCode', () => {
    it('fetches a country by code from the API', async () => {
      // Mock successful response
      fetch.mockResolvedValue({
        ok: true,
        json: async () => [mockCountries[0]],
      });

      const result = await getCountryByCode('USA');

      // Check that fetch was called with the correct URL
      expect(fetch).toHaveBeenCalledWith('https://restcountries.com/v3.1/alpha/USA');
      
      // Check that the function returns the expected data
      expect(result).toEqual([mockCountries[0]]);
    });

    it('throws an error when the API request fails', async () => {
      // Mock failed response
      fetch.mockResolvedValue({
        ok: false,
        status: 500,
      });

      // Mock console.error
      const originalConsoleError = console.error;
      console.error = vi.fn();

      // Check that the function throws an error
      await expect(getCountryByCode('USA')).rejects.toThrow('HTTP error! Status: 500');

      // Check that console.error was called
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching country with code "USA":',
        expect.any(Error)
      );

      // Restore console.error
      console.error = originalConsoleError;
    });
  });
});