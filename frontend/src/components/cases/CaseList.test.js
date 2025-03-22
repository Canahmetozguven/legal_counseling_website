import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../features/auth/AuthContext';
import CaseList from './CaseList';
import * as caseService from '../../api/caseService';

jest.mock('../../api/caseService');

const mockCases = [
  {
    _id: '1',
    title: 'Employment Case',
    caseType: 'employment',
    status: 'active',
    client: {
      firstName: 'John',
      lastName: 'Doe'
    },
    priority: 'high',
    lastUpdated: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Civil Dispute',
    caseType: 'civil',
    status: 'pending',
    client: {
      firstName: 'Jane',
      lastName: 'Smith'
    },
    priority: 'medium',
    lastUpdated: new Date().toISOString()
  }
];

const renderCaseList = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <CaseList />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('CaseList Component', () => {
  beforeEach(() => {
    caseService.getAllCases.mockResolvedValue({ data: { cases: mockCases } });
  });

  it('renders case list with cases', async () => {
    renderCaseList();

    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
      expect(screen.getByText('Civil Dispute')).toBeInTheDocument();
    });
  });

  it('filters cases by status', async () => {
    renderCaseList();
    
    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
    });

    const statusFilter = screen.getByLabelText('Status');
    fireEvent.change(statusFilter, { target: { value: 'active' } });

    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
      expect(screen.queryByText('Civil Dispute')).not.toBeInTheDocument();
    });
  });

  it('filters cases by type', async () => {
    renderCaseList();

    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
    });

    const typeFilter = screen.getByLabelText('Case Type');
    fireEvent.change(typeFilter, { target: { value: 'civil' } });

    await waitFor(() => {
      expect(screen.queryByText('Employment Case')).not.toBeInTheDocument();
      expect(screen.getByText('Civil Dispute')).toBeInTheDocument();
    });
  });

  it('sorts cases by priority', async () => {
    renderCaseList();

    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
    });

    const sortButton = screen.getByText('Priority');
    fireEvent.click(sortButton);

    const caseItems = screen.getAllByTestId('case-item');
    expect(caseItems[0]).toHaveTextContent('Employment Case');
    expect(caseItems[1]).toHaveTextContent('Civil Dispute');
  });

  it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch cases';
    caseService.getAllCases.mockRejectedValue(new Error(errorMessage));

    renderCaseList();

    await waitFor(() => {
      expect(screen.getByText(/error loading cases/i)).toBeInTheDocument();
    });
  });

  it('opens case details when clicking on a case', async () => {
    renderCaseList();

    await waitFor(() => {
      expect(screen.getByText('Employment Case')).toBeInTheDocument();
    });

    const caseItem = screen.getByText('Employment Case');
    fireEvent.click(caseItem);

    expect(window.location.pathname).toBe('/cases/1');
  });
});