import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Article } from './Article';
import { ThemeProvider, createTheme } from '@mui/material';

describe('Article Component', () => {
  const theme = createTheme();

  const mockArticle = {
    id: '1',
    title: 'Test Article',
    publishDate: new Date('2024-01-01T10:00:00.000Z'),
    url: 'https://test.com/article',
    image: 'https://test.com/image.jpg'
  };

  // Mock window.open
  const mockOpen = jest.fn();
  window.open = mockOpen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithTheme = (component: React.ReactNode) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders article title', () => {
    renderWithTheme(<Article article={mockArticle} />);
    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });

  it('renders publish date', () => {
    renderWithTheme(<Article article={mockArticle} />);
    expect(screen.getByText('Mon Jan 01 2024')).toBeInTheDocument();
  });

  it('renders article image', () => {
    renderWithTheme(<Article article={mockArticle} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://test.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Article');
  });

  it('opens article URL in new tab when clicked', async () => {
    renderWithTheme(<Article article={mockArticle} />);
    
    const clickableArea = screen.getByRole('button');
    await userEvent.click(clickableArea);
    
    expect(mockOpen).toHaveBeenCalledWith('https://test.com/article', '_blank');
  });

  it('handles null publish date', () => {
    const articleWithNullDate = {
      ...mockArticle,
      publishDate: null
    };
    
    renderWithTheme(<Article article={articleWithNullDate} />);
    expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument(); // No date should be rendered
  });

  it('renders with correct typography variants', () => {
    renderWithTheme(<Article article={mockArticle} />);
    
    const title = screen.getByText('Test Article');
    expect(title.closest('.MuiTypography-h6')).toBeInTheDocument();
    
    const date = screen.getByText('Mon Jan 01 2024');
    expect(date.closest('.MuiTypography-body2')).toBeInTheDocument();
  });
}); 