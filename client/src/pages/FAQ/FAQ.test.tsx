import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQ from './FAQ';
import { ThemeProvider, createTheme } from '@mui/material';

describe('FAQ Component', () => {
  const theme = createTheme();

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders FAQ title and description', () => {
    renderWithTheme(<FAQ />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText(/Find answers to common questions/)).toBeInTheDocument();
  });

  it('renders FAQ items', () => {
    renderWithTheme(<FAQ />);
    
    expect(screen.getByText(/What is a stock?/i)).toBeInTheDocument();
    expect(screen.getByText(/What is a bond?/i)).toBeInTheDocument();
  });

  it('expands and collapses FAQ items when clicked', async () => {
    renderWithTheme(<FAQ />);
    
    const question = screen.getByText(/What is a stock?/i);
    await userEvent.click(question);
    
    // Check if answer is visible
    expect(screen.getByText(/A stock represents/i)).toBeInTheDocument();
    
    // Click again to collapse
    await userEvent.click(question);
    expect(screen.queryByText(/A stock represents/i)).not.toBeInTheDocument();
  });

  it('shows correct expand/collapse icons', async () => {
    renderWithTheme(<FAQ />);
    
    const question = screen.getByText(/What is a stock?/i);
    
    // Initially expanded icon should be visible
    expect(screen.getAllByTestId('AddIcon')[0]).toBeInTheDocument();
    
    // Click to expand
    await userEvent.click(question);
    expect(screen.getAllByTestId('RemoveIcon')[0]).toBeInTheDocument();
  });

  it('allows multiple FAQ items to be open', async () => {
    renderWithTheme(<FAQ />);
    
    await userEvent.click(screen.getByText(/What is a stock?/i));
    await userEvent.click(screen.getByText(/What is a bond?/i));
    
    // Both answers should be visible
    expect(screen.getByText(/A stock represents/i)).toBeInTheDocument();
    expect(screen.getByText(/A bond is a debt instrument/i)).toBeInTheDocument();
  });

}); 