import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/setup';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Login from '../Login';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Mock firebase/auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the login form', () => {
    render(<Login />);

    // Check that the login form is rendered
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
  });

  it('toggles between login and signup modes', async () => {
    const user = userEvent.setup();
    render(<Login />);

    // Initially in login mode
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();

    // Click the Sign Up button to switch to signup mode
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Now in signup mode
    expect(screen.getByRole('heading', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();

    // Click the Login button to switch back to login mode
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // Back in login mode
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  it('handles login form submission', async () => {
    // Mock successful login
    signInWithEmailAndPassword.mockResolvedValue({});

    const user = userEvent.setup();
    render(<Login />);

    // Fill in the form
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // Check that signInWithEmailAndPassword was called with the correct arguments
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password123'
    );
  });

  it('handles signup form submission', async () => {
    // Mock successful signup
    createUserWithEmailAndPassword.mockResolvedValue({});

    const user = userEvent.setup();
    render(<Login />);

    // Switch to signup mode
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Fill in the form
    await user.type(screen.getByLabelText('Email'), 'newuser@example.com');
    await user.type(screen.getByLabelText('Password'), 'newpassword123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Check that createUserWithEmailAndPassword was called with the correct arguments
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'newuser@example.com',
      'newpassword123'
    );
  });

  it('displays error message when login fails', async () => {
    // Mock failed login
    const errorMessage = 'Invalid email or password';
    signInWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const user = userEvent.setup();
    render(<Login />);

    // Fill in the form
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Login' }));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Check that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Authentication error:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('displays error message when signup fails', async () => {
    // Mock failed signup
    const errorMessage = 'Email already in use';
    createUserWithEmailAndPassword.mockRejectedValue(new Error(errorMessage));

    // Mock console.error
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const user = userEvent.setup();
    render(<Login />);

    // Switch to signup mode
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Fill in the form
    await user.type(screen.getByLabelText('Email'), 'existing@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Check that console.error was called
    expect(console.error).toHaveBeenCalledWith(
      'Authentication error:',
      expect.any(Error)
    );

    // Restore console.error
    console.error = originalConsoleError;
  });
});
