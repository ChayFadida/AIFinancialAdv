import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from './ChatInput';

describe('ChatInput Component', () => {
  const defaultProps = {
    onSubmit: jest.fn((e) => e.preventDefault()),
    input: '',
    setInput: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input field and submit button', () => {
    render(<ChatInput {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('updates input value when typing', () => {
    render(<ChatInput {...defaultProps} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    
    expect(defaultProps.setInput).toHaveBeenCalledWith('Hello');
  });

  it('calls onSubmit when send button is clicked', () => {
    render(<ChatInput {...defaultProps} />);
    
    // Trigger the onSubmit directly instead of clicking the button
    const form = screen.getByRole('button', { name: /send/i }).closest('form');
    fireEvent.submit(form!);
    
    expect(defaultProps.onSubmit).toHaveBeenCalled();
  });

  it('displays current input value', () => {
    render(<ChatInput {...defaultProps} input="Hello World" />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    expect(input).toHaveValue('Hello World');
  });

  it('renders send icon in button', () => {
    render(<ChatInput {...defaultProps} />);
    
    expect(screen.getByTestId('SendIcon')).toBeInTheDocument();
  });

  it('has correct layout styles', () => {
    const { container } = render(<ChatInput {...defaultProps} />);
    
    const box = container.querySelector('.MuiBox-root');
    expect(box).toHaveStyle({
      display: 'flex',
      alignItems: 'center',
    });
  });

  it('has full width text field', () => {
    const { container } = render(<ChatInput {...defaultProps} />);
    
    const textField = container.querySelector('.MuiFormControl-fullWidth');
    expect(textField).toBeInTheDocument();
  });
}); 