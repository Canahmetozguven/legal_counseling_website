import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ClientList from './ClientList';
import * as clientService from '../../api/clientService';

// Mock the client service
jest.mock('../../api/clientService');

const mockClients = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890'
  },
  {
    _id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0987654321'
  }
];

const renderClientList = () => {
  return render(
    <BrowserRouter>
      <ClientList />
    </BrowserRouter>
  );
};

describe('ClientList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of clients', async () => {
    clientService.getAllClients.mockResolvedValueOnce({ data: { clients: mockClients } });

    renderClientList();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('shows loading state while fetching clients', () => {
    clientService.getAllClients.mockImplementation(() => new Promise(() => {}));

    renderClientList();

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('shows error message when client fetch fails', async () => {
    const errorMessage = 'Failed to fetch clients';
    clientService.getAllClients.mockRejectedValueOnce(new Error(errorMessage));

    renderClientList();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('filters clients by search term', async () => {
    clientService.getAllClients.mockResolvedValueOnce({ data: { clients: mockClients } });

    renderClientList();

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/search clients/i);
      fireEvent.change(searchInput, { target: { value: 'john' } });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  it('handles client deletion', async () => {
    clientService.getAllClients.mockResolvedValueOnce({ data: { clients: mockClients } });
    clientService.deleteClient.mockResolvedValueOnce({ status: 'success' });

    renderClientList();

    await waitFor(() => {
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      fireEvent.click(deleteButton);
    });

    // Confirm deletion dialog
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(clientService.deleteClient).toHaveBeenCalledWith('1');
      expect(screen.getByText(/client deleted successfully/i)).toBeInTheDocument();
    });
  });

  it('sorts clients by name', async () => {
    clientService.getAllClients.mockResolvedValueOnce({ data: { clients: mockClients } });

    renderClientList();

    await waitFor(() => {
      const sortButton = screen.getByRole('button', { name: /sort by name/i });
      fireEvent.click(sortButton);

      const clientNames = screen.getAllByTestId('client-name');
      expect(clientNames[0]).toHaveTextContent('Jane Smith');
      expect(clientNames[1]).toHaveTextContent('John Doe');
    });
  });
});