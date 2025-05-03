import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock the fetch API
vi.stubGlobal('fetch', vi.fn());

// Reset all mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
});

// Mock for react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ code: 'USA' }),
  };
});

// Create a wrapper for Router context
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

// Override render method to include Router
const customRender = (ui, options) => {
  return render(ui, { wrapper: BrowserRouter, ...options });
};

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Mock for firebase auth
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  getAuth: vi.fn(() => ({})),
}));

// Mock for AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { email: 'test@example.com' },
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }) => children,
}));
