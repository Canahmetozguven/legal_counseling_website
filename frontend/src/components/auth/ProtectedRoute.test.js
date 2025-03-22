import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Mock components for testing
const MockDashboard = () => <div>Dashboard</div>;
const MockLogin = () => <div>Login Page</div>;

// Mock AuthContext values
const mockAuthContext = {
  isAuthenticated: true,
  user: { name: 'Test User' },
};

const mockUnauthContext = {
  isAuthenticated: false,
  user: null,
};

// Setup render function with different auth states
const renderWithAuth = (authValue) => {
  return render(
    <BrowserRouter>
      <AuthProvider value={authValue}>
        <Routes>
          <Route path="/login" element={<MockLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MockDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('renders child component when user is authenticated', () => {
    renderWithAuth(mockAuthContext);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithAuth(mockUnauthContext);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('shows loading state while checking authentication', () => {
    renderWithAuth({ ...mockAuthContext, loading: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});