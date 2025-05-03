import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/setup';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CountryDetail from '../CountryDetail';
import { getCountryByCode } from '../../services/countryService';

// Mock the API service function
vi.mock('../../services/countryService', () => ({
  getCountryByCode: vi.fn(),
}));

// Sample country data for testing
const mockCountry = {
  name: { common: 'United States', official: 'United States of America' },
  cca3: 'USA',
  flags: { png: 'usa-flag.png', svg: 'usa-flag.svg' },
  capital: ['Washington, D.C.'],
  region: 'Americas',
  subregion: 'North America',
  population: 331002651,
  languages: { eng: 'English' },
  currencies: { USD: { name: 'United States dollar', symbol: '$' } },
  tld: ['.us'],
  area: 9372610,
  borders: ['CAN', 'MEX'],
};

describe('CountryDetail Component', () => {
  beforeEach(() => {
    // Reset mocks and set default return value
    vi.resetAllMocks();
    getCountryByCode.mockResolvedValue([mockCountry]);
  });

  it('renders loading spinner initially', () => {
    render(<CountryDetail />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders country details after loading', async () => {
    render(<CountryDetail />);

    // Wait for the country details to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check if country details are displayed
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United States of America')).toBeInTheDocument();
    expect(screen.getByText(/Washington, D.C./i)).toBeInTheDocument();
    expect(screen.getByText(/331,002,651/i)).toBeInTheDocument();
    expect(screen.getByText(/Americas/i)).toBeInTheDocument();
    expect(screen.getByText(/North America/i)).toBeInTheDocument();
    expect(screen.getByText(/English/i)).toBeInTheDocument();
  });

  it('shows error message when API call fails', async () => {
    // Mock API failure
    getCountryByCode.mockRejectedValue(new Error('Failed to fetch'));

    render(<CountryDetail />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to load country details/i)).toBeInTheDocument();
  });

  it('displays border countries when available', async () => {
    render(<CountryDetail />);

    // Wait for the country details to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check if border countries are displayed
    expect(screen.getByText('Border Countries:')).toBeInTheDocument();
    expect(screen.getByText('CAN')).toBeInTheDocument();
    expect(screen.getByText('MEX')).toBeInTheDocument();
  });

  it('renders back button', async () => {
    render(<CountryDetail />);

    // Check if back button is displayed
    expect(screen.getByText('← Back')).toBeInTheDocument();
  });
});
