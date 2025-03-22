import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContactForm from './ContactForm';
import * as contactService from '../../api/contactService';

jest.mock('../../api/contactService');

describe('ContactForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' }
    });
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: 'Legal Consultation' }
    });
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: 'I need legal advice regarding my case.' }
    });
  };

  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    contactService.submitContact.mockResolvedValueOnce({
      status: 'success',
      message: 'Contact form submitted successfully'
    });

    render(<ContactForm />);
    fillForm();
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(contactService.submitContact).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        subject: 'Legal Consultation',
        message: 'I need legal advice regarding my case.'
      });
      expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for empty required fields', async () => {
    render(<ContactForm />);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });

    expect(contactService.submitContact).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it('handles form submission error', async () => {
    const errorMessage = 'Failed to submit form';
    contactService.submitContact.mockRejectedValueOnce(new Error(errorMessage));

    render(<ContactForm />);
    fillForm();
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    contactService.submitContact.mockResolvedValueOnce({
      status: 'success',
      message: 'Contact form submitted successfully'
    });

    render(<ContactForm />);
    fillForm();
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/phone/i)).toHaveValue('');
      expect(screen.getByLabelText(/subject/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });
  });
});