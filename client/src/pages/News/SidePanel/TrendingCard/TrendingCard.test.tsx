import { render, screen, waitFor, act } from '@testing-library/react';
import { TrendingCard } from './TrendingCard';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the entire yahooAxios module
jest.mock('../../../../services/axios/yahooAxios', () => ({
  yahooAxios: {
    get: jest.fn()
  }
}));

// Import the mocked module
import { yahooAxios } from '../../../../services/axios/yahooAxios';

describe('TrendingCard Component', () => {
  const theme = createTheme();
  const mockedGet = yahooAxios.get as jest.Mock;

  const mockTrendingData = {
    data: {
      finance: {
        result: [{
          quotes: [
            {
              symbol: 'NVDA',
              regularMarketPreviousClose: 450.75,
              longName: 'NVIDIA Corporation',
              regularMarketChangePercent: 5.5,
              regularMarketChange: 24.75
            },
            {
              symbol: 'AMD',
              regularMarketPreviousClose: 120.50,
              longName: 'Advanced Micro Devices, Inc.',
              regularMarketChangePercent: 4.8,
              regularMarketChange: 5.41
            }
          ]
        }]
      }
    }
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
    mockedGet.mockReset();
  });

  it('renders trending card with title', async () => {
    mockedGet.mockResolvedValueOnce(mockTrendingData);
    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });
    
    expect(screen.getByText('Trending tickers')).toBeInTheDocument();
  });

  it('fetches and displays trending data', async () => {
    mockedGet.mockResolvedValueOnce(mockTrendingData);
    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });

    await waitFor(() => {
      expect(screen.getByText('NVDA')).toBeInTheDocument();
      expect(screen.getByText('NVIDIA Corporation')).toBeInTheDocument();
      expect(screen.getByText('AMD')).toBeInTheDocument();
      expect(screen.getByText('Advanced Micro Devices, Inc.')).toBeInTheDocument();
    });
  });

  it('makes correct API call', async () => {
    mockedGet.mockResolvedValueOnce(mockTrendingData);
    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/market/get-trending');
    });
  });

  it('handles empty response', async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        finance: {
          result: [{
            quotes: []
          }]
        }
      }
    });

    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
      expect(screen.queryByText('NVDA')).not.toBeInTheDocument();
    });
  });

  it('limits displayed trending tickers to 5', async () => {
    const manyTrending = {
      data: {
        finance: {
          result: [{
            quotes: Array(10).fill({
              symbol: 'NVDA',
              regularMarketPreviousClose: 450.75,
              longName: 'NVIDIA Corporation',
              regularMarketChangePercent: 5.5,
              regularMarketChange: 24.75
            })
          }]
        }
      }
    };

    mockedGet.mockResolvedValueOnce(manyTrending);
    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });

    await waitFor(() => {
      const symbols = screen.getAllByText('NVDA');
      expect(symbols).toHaveLength(5);
    });
  });

  it('formats data correctly', async () => {
    mockedGet.mockResolvedValueOnce(mockTrendingData);
    await act(async () => {
      renderWithTheme(<TrendingCard />);
    });

    await waitFor(() => {
      const firstStock = {
        symbol: screen.getByText('NVDA'),
        name: screen.getByText('NVIDIA Corporation'),
      };
      expect(firstStock.symbol).toBeInTheDocument();
      expect(firstStock.name).toBeInTheDocument();
    });
  });
}); 