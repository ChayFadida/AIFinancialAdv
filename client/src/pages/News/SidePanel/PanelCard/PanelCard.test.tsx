import { render, screen } from '@testing-library/react';
import { PanelCard } from './PanelCard';
import { ThemeProvider, createTheme } from '@mui/material';

// Define the type inline instead of importing
interface CardItemType {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

describe('PanelCard Component', () => {
  const theme = createTheme();

  const mockData: CardItemType[] = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.25,
      change: 3.75,
      changePercent: 2.5
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: 2800.50,
      change: -50.41,
      changePercent: -1.8
    }
  ];

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders panel card with title', () => {
    renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders all card items', () => {
    renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    // Check for stock symbols
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('GOOGL')).toBeInTheDocument();
    
    // Check for company names
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
    expect(screen.getByText('Alphabet Inc.')).toBeInTheDocument();
  });

  it('renders dividers between items', () => {
    const { container } = renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    // Check for dividers (should be one less than the number of items)
    const dividers = container.querySelectorAll('.MuiDivider-root');
    expect(dividers.length).toBe(mockData.length - 1);
  });

  it('does not render divider after last item', () => {
    const { container } = renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    const lastItem = screen.getByText('Alphabet Inc.');
    const nextElement = lastItem.parentElement?.nextElementSibling;
    expect(nextElement).not.toHaveClass('MuiDivider-root');
  });

  it('handles empty data array', () => {
    renderWithTheme(<PanelCard title="Test Title" data={[]} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    const { container } = renderWithTheme(<PanelCard title="Test Title" data={[]} />);
    const dividers = container.querySelectorAll('.MuiDivider-root');
    expect(dividers.length).toBe(0);
  });

  it('renders with correct styles', () => {
    const { container } = renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    const card = container.querySelector('.MuiCard-root');
    expect(card).toHaveStyle({
      padding: '8px',
      minHeight: '268px'
    });
  });

  it('renders title with correct typography variant', () => {
    renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    const title = screen.getByText('Test Title');
    expect(title.closest('.MuiTypography-h6')).toBeInTheDocument();
  });

  it('renders all items with correct data', () => {
    renderWithTheme(<PanelCard title="Test Title" data={mockData} />);
    
    mockData.forEach(item => {
      expect(screen.getByText(item.symbol)).toBeInTheDocument();
      expect(screen.getByText(item.name)).toBeInTheDocument();
      // Check for price changes
      expect(screen.getByText(new RegExp(`${item.change.toFixed(2)}`))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${Math.abs(item.changePercent).toFixed(2)}%`))).toBeInTheDocument();
    });
  });
}); 