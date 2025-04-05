import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import DashboardHome from './DashboardHome';

// Mock axios
jest.mock('axios');

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the nivo pie chart component
jest.mock('@nivo/pie', () => ({
  ResponsivePie: () => <div data-testid="mock-pie-chart" />,
}));

// Mock the date picker to avoid MUI issues in tests
jest.mock('@mui/x-date-pickers', () => ({
  LocalizationProvider: ({ children }) => <div>{children}</div>,
  CalendarPicker: () => <div data-testid="mock-calendar" />,
}));

describe('DashboardHome Component', () => {
  const mockStatsData = {
    data: {
      totalClients: 42,
      totalCases: 15,
      totalAppointments: 8,
      totalBlogs: 23,
      caseStatusCounts: {
        active: 5,
        closed: 3,
        pending: 7,
      },
    },
  };

  const mockAppointmentsData = {
    data: {
      appointments: [
        {
          _id: '1',
          title: 'Initial Consultation',
          date: '2025-04-10T09:00:00.000Z',
          startTime: '09:00',
          endTime: '10:00',
          client: { firstName: 'John', lastName: 'Doe' },
        },
        {
          _id: '2',
          title: 'Contract Review',
          date: '2025-04-15T14:00:00.000Z',
          startTime: '14:00',
          endTime: '15:30',
          client: { firstName: 'Jane', lastName: 'Smith' },
        },
      ],
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('displays loading indicator initially', () => {
    axios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders dashboard stats correctly after loading', async () => {
    axios.get.mockImplementation(url => {
      if (url === '/api/dashboard/stats') {
        return Promise.resolve({ data: mockStatsData.data });
      } else if (url === '/api/appointments/recent') {
        return Promise.resolve({ data: mockAppointmentsData.data });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    // Wait for loading to finish and stats to be displayed
    await waitFor(() => {
      expect(screen.getByText('Total Clients')).toBeInTheDocument();
    });

    // Check if stats are displayed correctly
    expect(screen.getByText('42')).toBeInTheDocument(); // Total Clients
    expect(screen.getByText('15')).toBeInTheDocument(); // Active Cases
    expect(screen.getByText('8')).toBeInTheDocument(); // Appointments
    expect(screen.getByText('23')).toBeInTheDocument(); // Blog Posts

    // Verify calendar is rendered
    expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();

    // Verify pie chart is rendered
    expect(screen.getByTestId('mock-pie-chart')).toBeInTheDocument();

    // Verify appointments are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Initial Consultation')).toBeInTheDocument();
    expect(screen.getByText('Contract Review')).toBeInTheDocument();
  });

  test('displays empty state when there are no appointments', async () => {
    axios.get.mockImplementation(url => {
      if (url === '/api/dashboard/stats') {
        return Promise.resolve({ data: mockStatsData.data });
      } else if (url === '/api/appointments/recent') {
        return Promise.resolve({ data: { appointments: [] } });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No upcoming appointments')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    // Mock API calls to fail
    axios.get.mockRejectedValue(new Error('API error'));

    render(
      <BrowserRouter>
        <DashboardHome />
      </BrowserRouter>
    );

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Dashboard should still render with default/empty values
    expect(screen.getByText('Total Clients')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
