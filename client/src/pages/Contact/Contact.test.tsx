import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from './Contact';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock axios module
jest.mock('axios', () => ({
  post: jest.fn()
}));

// Import the mocked module
import axios from 'axios';

// Increase Jest timeout for this file
jest.setTimeout(10000);

describe('Contact Component', () => {
  const theme = createTheme();
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contact form with title', () => {
    renderWithTheme(<Contact />);
    
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('handles form submission successfully', async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    renderWithTheme(<Contact />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit the form using fireEvent instead of userEvent
    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Check if axios was called with correct data
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3001/api/contact',
        {
          name: 'John Doe',
          email: 'john@example.com',
          message: 'Test message'
        }
      );
    });

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });
  });

  it('handles form submission error', async () => {
    (mockedAxios.post as jest.Mock).mockRejectedValueOnce(new Error('Failed to send'));
    renderWithTheme(<Contact />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit the form
    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to send message. Please try again.')).toBeInTheDocument();
    });
  });

  it('clears form after successful submission', async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    renderWithTheme(<Contact />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');

    // Submit the form
    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Check if form fields are cleared
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
    });
  });

  it('validates form before submission', async () => {
    renderWithTheme(<Contact />);
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    expect(submitButton).toBeDisabled();

    // Fill out form partially
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    expect(submitButton).toBeDisabled();

    // Complete the form
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
    expect(submitButton).toBeEnabled();
  });

  it('closes snackbar after timeout', async () => {
    (mockedAxios.post as jest.Mock).mockResolvedValueOnce({ data: {} });
    renderWithTheme(<Contact />);

    // Fill and submit form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Test message');
    
    // Submit form using form submission instead of button click
    const form = screen.getByRole('button', { name: /send message/i }).closest('form')!;
    form.dispatchEvent(new Event('submit', { bubbles: true }));

    // Check snackbar appears
    await waitFor(() => {
      expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
    });

    // Wait for snackbar to close with increased timeout
    await waitFor(() => {
      expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
    }, { timeout: 8000 });
  }, 10000); // Add test-specific timeout
}); 