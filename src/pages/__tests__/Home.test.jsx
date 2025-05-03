import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/setup';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../Home';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock the CountryList component
vi.mock('../../components/CountryList', () => ({
  default: () => <div data-testid="country-list">Country List Component</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the navbar and country list', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
      logout: vi.fn(),
    });

    render(<Home />);

    // Check that the navbar is rendered
    expect(screen.getByText('Countries Explorer')).toBeInTheDocument();
    
    // Check that the country list is rendered
    expect(screen.getByTestId('country-list')).toBeInTheDocument();
  });

  it('shows login link when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
      logout: vi.fn(),
    });

    render(<Home />);

    // Check that the login link is rendered
    expect(screen.getByText('Login')).toBeInTheDocument();
    
    // Check that the logout button is not rendered
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows user email and logout button when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
      logout: vi.fn(),
    });

    render(<Home />);

    // Check that the user email is rendered
    expect(screen.getByText('Signed in as:')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    
    // Check that the logout button is rendered
    expect(screen.getByText('Logout')).toBeInTheDocument();
    
    // Check that the login link is not rendered
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('shows profile link when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
      logout: vi.fn(),
    });

    render(<Home />);

    // Check that the profile link is rendered
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('calls logout function and navigates when logout button is clicked', async () => {
    // Mock authenticated user with logout function
    const mockLogout = vi.fn().mockResolvedValue();
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<Home />);

    // Click the logout button
    await user.click(screen.getByText('Logout'));

    // Check that the logout function was called
    expect(mockLogout).toHaveBeenCalled();
  });

  it('handles logout error', async () => {
    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    // Mock authenticated user with logout function that throws an error
    const mockLogout = vi.fn().mockRejectedValue(new Error('Logout failed'));
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
      logout: mockLogout,
    });

    const user = userEvent.setup();
    render(<Home />);

    // Click the logout button
    await user.click(screen.getByText('Logout'));

    // Check that the logout function was called
    expect(mockLogout).toHaveBeenCalled();

    // Check that the error was logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Failed to log out', expect.any(Error));
    });

    // Restore console.error
    console.error = originalConsoleError;
  });
});