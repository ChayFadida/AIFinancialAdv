import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactPaper } from './ContactPaper';
import { ThemeProvider, createTheme } from '@mui/material';

describe('ContactPaper Component', () => {
  const theme = createTheme();

  const mockFormData = {
    name: '',
    email: '',
    message: '',
  };

  const defaultProps = {
    formData: mockFormData,
    handleChange: jest.fn(),
    handleSubmit: jest.fn((e) => e.preventDefault()),
    isFormValid: false,
  };

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

  it('renders all form fields', () => {
    renderWithTheme(<ContactPaper {...defaultProps} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('handles input changes', async () => {
    renderWithTheme(<ContactPaper {...defaultProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    await userEvent.type(nameInput, 'John Doe');

    expect(defaultProps.handleChange).toHaveBeenCalled();
  });

  it('displays form values', () => {
    const filledFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello World',
    };

    renderWithTheme(<ContactPaper {...defaultProps} formData={filledFormData} />);

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Hello World');
  });

  it('handles form submission', async () => {
    renderWithTheme(<ContactPaper {...defaultProps} isFormValid={true} />);

    const form = screen.getByRole('button', { name: /send message/i }).closest('form');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(defaultProps.handleSubmit).toHaveBeenCalled();
  });

  it('disables submit button when form is invalid', () => {
    renderWithTheme(<ContactPaper {...defaultProps} isFormValid={false} />);

    expect(screen.getByRole('button', { name: /send message/i })).toBeDisabled();
  });

  it('enables submit button when form is valid', () => {
    renderWithTheme(<ContactPaper {...defaultProps} isFormValid={true} />);

    expect(screen.getByRole('button', { name: /send message/i })).toBeEnabled();
  });

  it('renders required fields', () => {
    renderWithTheme(<ContactPaper {...defaultProps} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('renders email field with email type', () => {
    renderWithTheme(<ContactPaper {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('type', 'email');
  });
}); 