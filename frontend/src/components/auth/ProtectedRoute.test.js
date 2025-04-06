import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to}>Navigate to {to}</div>,
  useLocation: jest.fn().mockReturnValue({ pathname: '/' })
}));

jest.mock('../../features/auth/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Import after mocks
const ProtectedRoute = require('./ProtectedRoute').default;
const { useAuth } = require('../../features/auth/AuthContext');

// Mock components
const MockDashboard = () => <div>Dashboard</div>;

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when authenticated', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockResolvedValue(true),
      loading: false
    });

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should redirect to login when not authenticated', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockResolvedValue(false),
      loading: false
    });

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);
    
    await waitFor(() => {
      const navigate = screen.getByTestId('navigate');
      expect(navigate.getAttribute('data-to')).toBe('/login');
    });
  });

  it('should show loading state while checking auth', () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn(),
      loading: true
    });

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should show loading while verifying authentication', async () => {
    const authCheckPromise = new Promise(resolve => setTimeout(() => resolve(true), 100));
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockReturnValue(authCheckPromise),
      loading: false
    });

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  it('should handle authentication errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockRejectedValue(new Error('Auth check failed')),
      loading: false
    });

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);
    
    await waitFor(() => {
      const navigate = screen.getByTestId('navigate');
      expect(navigate.getAttribute('data-to')).toBe('/login');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[AUTH] Error in ProtectedRoute:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should preserve the return URL when redirecting to login', async () => {
    useAuth.mockReturnValue({
      isAuthenticated: jest.fn().mockResolvedValue(false),
      loading: false
    });

    const mockLocation = { pathname: '/dashboard/settings' };
    require('react-router-dom').useLocation.mockReturnValue(mockLocation);

    render(<ProtectedRoute><MockDashboard /></ProtectedRoute>);

    await waitFor(() => {
      const navigate = screen.getByTestId('navigate');
      expect(navigate.getAttribute('data-to')).toBe('/login?returnUrl=/dashboard/settings');
    });
  });
});
