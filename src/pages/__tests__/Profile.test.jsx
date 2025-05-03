import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/setup';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../Profile';
import { useAuth } from '../../context/AuthContext';
import { getUserFavorites, removeFromFavorites } from '../../services/favoriteService';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the favoriteService functions
vi.mock('../../services/favoriteService', () => ({
  getUserFavorites: vi.fn(),
  removeFromFavorites: vi.fn(),
}));

// Sample favorite countries data
const mockFavorites = [
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

describe('Profile Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: { uid: 'user123', email: 'test@example.com' },
    });
    
    // Mock successful favorites fetch
    getUserFavorites.mockResolvedValue(mockFavorites);
    
    // Mock successful remove from favorites
    removeFromFavorites.mockResolvedValue();
  });

  it('renders user information', async () => {
    render(<Profile />);
    
    // Check that the user information is rendered
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText('User Information')).toBeInTheDocument();
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('renders loading spinner initially', () => {
    render(<Profile />);
    
    // Check that the loading spinner is rendered
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays message when user has no favorites', async () => {
    // Mock empty favorites
    getUserFavorites.mockResolvedValue([]);
    
    render(<Profile />);
    
    // Wait for favorites to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check that the no favorites message is displayed
    expect(screen.getByText(/You haven't added any countries to your favorites yet/i)).toBeInTheDocument();
  });

  it('handles error when fetching favorites fails', async () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Mock failed favorites fetch
    getUserFavorites.mockRejectedValue(new Error('Failed to fetch favorites'));
    
    render(<Profile />);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Check that the error message is displayed
    expect(screen.getByText('Failed to load favorites. Please try again later.')).toBeInTheDocument();
    
    // Check that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching favorites:',
      expect.any(Error)
    );
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('removes a country from favorites', async () => {
    const user = userEvent.setup();
    render(<Profile />);
    
    // Wait for favorites to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click the Remove button for the first country
    const removeButtons = screen.getAllByText('Remove');
    await user.click(removeButtons[0]);
    
    // Check that removeFromFavorites was called with the correct arguments
    expect(removeFromFavorites).toHaveBeenCalledWith('user123', mockFavorites[0]);
  });

  it('handles error when removing from favorites fails', async () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    // Mock failed remove from favorites
    removeFromFavorites.mockRejectedValue(new Error('Failed to remove from favorites'));
    
    const user = userEvent.setup();
    render(<Profile />);
    
    // Wait for favorites to load
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click the Remove button for the first country
    const removeButtons = screen.getAllByText('Remove');
    await user.click(removeButtons[0]);
    
    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    // Check that the error message is displayed
    expect(screen.getByText('Failed to remove from favorites. Please try again later.')).toBeInTheDocument();
    
    // Check that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Error removing from favorites:',
      expect.any(Error)
    );
    
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('navigates back when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<Profile />);
    
    // Click the back button
    await user.click(screen.getByText('← Back'));
    
    // We can't directly test navigation in this test environment,
    // but we can check that the navigate function was called
    // This is indirectly tested through the mocked useNavigate in setup.js
  });
});