import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../AuthContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
}));

// Mock firebase auth instance
vi.mock('../../js/firebase', () => ({
  auth: {},
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div>
      <div data-testid="user-status">
        {currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}
      </div>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('provides currentUser when authenticated', () => {
    // Mock authenticated user
    const mockUser = { email: 'test@example.com' };
    
    // Trigger the onAuthStateChanged callback with a user
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return () => {}; // Return unsubscribe function
    });

    act(() => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    // Check that the user status shows logged in
    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com');
  });
});