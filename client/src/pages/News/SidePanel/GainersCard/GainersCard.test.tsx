import { render, screen, waitFor, act } from '@testing-library/react';
import { GainersCard } from './GainersCard';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the entire yahooAxios module
jest.mock('../../../../services/axios/yahooAxios', () => ({
  yahooAxios: {
    get: jest.fn()
  }
}));

// Import the mocked module
import { yahooAxios } from '../../../../services/axios/yahooAxios';

describe('GainersCard Component', () => {
  const theme = createTheme();
  const mockedGet = yahooAxios.get as jest.Mock;

  const mockGainersData = {
    data: {
      finance: {
        result: [{
          quotes: [
            {
              symbol: 'AAPL',
              regularMarketPreviousClose: 150.25,
              longName: 'Apple Inc.',
              regularMarketChangePercent: 2.5,
              regularMarketChange: 3.75
            },
            {
              symbol: 'GOOGL',
              regularMarketPreviousClose: 2800.50,
              longName: 'Alphabet Inc.',
              regularMarketChangePercent: 1.8,
              regularMarketChange: 50.41
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

  it('renders gainers card with title', async () => {
    mockedGet.mockResolvedValueOnce(mockGainersData);
    await act(async () => {
      renderWithTheme(<GainersCard />);
    });
    
    expect(screen.getByText('Top gainers')).toBeInTheDocument();
  });

  it('fetches and displays gainers data', async () => {
    mockedGet.mockResolvedValueOnce(mockGainersData);
    await act(async () => {
      renderWithTheme(<GainersCard />);
    });

    await waitFor(() => {
      expect(screen.getByText('AAPL')).toBeInTheDocument();
      expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
      expect(screen.getByText('GOOGL')).toBeInTheDocument();
      expect(screen.getByText('Alphabet Inc.')).toBeInTheDocument();
    });
  });

  it('makes correct API call', async () => {
    mockedGet.mockResolvedValueOnce(mockGainersData);
    await act(async () => {
      renderWithTheme(<GainersCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/market/get-day-gainers');
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
      renderWithTheme(<GainersCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
      expect(screen.queryByText('AAPL')).not.toBeInTheDocument();
    });
  });

  it('limits displayed gainers to 5', async () => {
    const manyGainers = {
      data: {
        finance: {
          result: [{
            quotes: Array(10).fill({
              symbol: 'AAPL',
              regularMarketPreviousClose: 150.25,
              longName: 'Apple Inc.',
              regularMarketChangePercent: 2.5,
              regularMarketChange: 3.75
            })
          }]
        }
      }
    };

    mockedGet.mockResolvedValueOnce(manyGainers);
    await act(async () => {
      renderWithTheme(<GainersCard />);
    });

    await waitFor(() => {
      const symbols = screen.getAllByText('AAPL');
      expect(symbols).toHaveLength(5);
    });
  });
}); 