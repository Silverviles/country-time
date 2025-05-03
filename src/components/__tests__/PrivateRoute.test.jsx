import { screen } from '@testing-library/react';
import { render } from '../../test/setup';
import { describe, it, expect, vi } from 'vitest';
import PrivateRoute from '../PrivateRoute';
import { useAuth } from '../../context/AuthContext';

// Mock the useAuth hook
vi.mock('../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('PrivateRoute Component', () => {
  it('renders children when user is authenticated', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: { email: 'test@example.com' },
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Check that the children are rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
    });

    render(
      <PrivateRoute>
        <div data-testid="protected-content">Protected Content</div>
      </PrivateRoute>
    );

    // Check that the children are not rendered
    // We can't directly test the Navigate component's behavior in this test environment,
    // but we can check that the children are not rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});