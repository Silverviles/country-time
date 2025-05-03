import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/setup';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CountryList from '../CountryList';
import { getAllCountries, getCountryByName, getCountriesByRegion } from '../../services/countryService';

// Mock the API service functions
vi.mock('../../services/countryService', () => ({
  getAllCountries: vi.fn(),
  getCountryByName: vi.fn(),
  getCountriesByRegion: vi.fn(),
}));

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

describe('CountryList Component', () => {
  beforeEach(() => {
    // Reset mocks and set default return values
    vi.resetAllMocks();
    getAllCountries.mockResolvedValue(mockCountries);
    getCountryByName.mockResolvedValue(mockCountries);
    getCountriesByRegion.mockResolvedValue(mockCountries);
  });

  it('renders loading spinner initially', () => {
    render(<CountryList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders country list after loading', async () => {
    render(<CountryList />);

    // Wait for the countries to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check if countries are displayed
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    // Mock API failure
    getAllCountries.mockRejectedValue(new Error('Failed to fetch'));

    render(<CountryList />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch countries/i)).toBeInTheDocument();
  });

  it('filters countries by search term', async () => {
    const user = userEvent.setup();
    render(<CountryList />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock search results
    getCountryByName.mockResolvedValue([mockCountries[0]]);

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/Search for a country/i);
    await user.type(searchInput, 'United');

    // Wait for filtered results
    await waitFor(() => {
      expect(getCountryByName).toHaveBeenCalledWith('United');
    });

    // Only United States should be visible
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });

  it('filters countries by region', async () => {
    const user = userEvent.setup();
    render(<CountryList />);

    // Wait for countries to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Mock region filter results
    getCountriesByRegion.mockResolvedValue([mockCountries[1]]);

    // Click region dropdown
    const regionDropdown = screen.getByText(/Filter by Region/i);
    await user.click(regionDropdown);

    // Select a region
    const regionOption = screen.getByText('Americas');
    await user.click(regionOption);

    // Wait for filtered results
    await waitFor(() => {
      expect(getCountriesByRegion).toHaveBeenCalledWith('Americas');
    });
  });
});
