import { render, screen, waitFor, act } from '@testing-library/react';
import { LosersCard } from './LosersCard';
import { ThemeProvider, createTheme } from '@mui/material';

// Mock the entire yahooAxios module
jest.mock('../../../../services/axios/yahooAxios', () => ({
  yahooAxios: {
    get: jest.fn()
  }
}));

// Import the mocked module
import { yahooAxios } from '../../../../services/axios/yahooAxios';

describe('LosersCard Component', () => {
  const theme = createTheme();
  const mockedGet = yahooAxios.get as jest.Mock;

  const mockLosersData = {
    data: {
      finance: {
        result: [{
          quotes: [
            {
              symbol: 'TSLA',
              regularMarketPreviousClose: 250.75,
              longName: 'Tesla Inc.',
              regularMarketChangePercent: -3.5,
              regularMarketChange: -8.75
            },
            {
              symbol: 'META',
              regularMarketPreviousClose: 320.50,
              longName: 'Meta Platforms Inc.',
              regularMarketChangePercent: -2.8,
              regularMarketChange: -9.41
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

  it('renders losers card with title', async () => {
    mockedGet.mockResolvedValueOnce(mockLosersData);
    await act(async () => {
      renderWithTheme(<LosersCard />);
    });
    
    expect(screen.getByText('Top losers')).toBeInTheDocument();
  });

  it('fetches and displays losers data', async () => {
    mockedGet.mockResolvedValueOnce(mockLosersData);
    await act(async () => {
      renderWithTheme(<LosersCard />);
    });

    await waitFor(() => {
      expect(screen.getByText('TSLA')).toBeInTheDocument();
      expect(screen.getByText('Tesla Inc.')).toBeInTheDocument();
      expect(screen.getByText('META')).toBeInTheDocument();
      expect(screen.getByText('Meta Platforms Inc.')).toBeInTheDocument();
    });
  });

  it('makes correct API call', async () => {
    mockedGet.mockResolvedValueOnce(mockLosersData);
    await act(async () => {
      renderWithTheme(<LosersCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith('/market/get-day-losers');
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
      renderWithTheme(<LosersCard />);
    });

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalled();
      expect(screen.queryByText('TSLA')).not.toBeInTheDocument();
    });
  });

  it('limits displayed losers to 5', async () => {
    const manyLosers = {
      data: {
        finance: {
          result: [{
            quotes: Array(10).fill({
              symbol: 'TSLA',
              regularMarketPreviousClose: 250.75,
              longName: 'Tesla Inc.',
              regularMarketChangePercent: -3.5,
              regularMarketChange: -8.75
            })
          }]
        }
      }
    };

    mockedGet.mockResolvedValueOnce(manyLosers);
    await act(async () => {
      renderWithTheme(<LosersCard />);
    });

    await waitFor(() => {
      const symbols = screen.getAllByText('TSLA');
      expect(symbols).toHaveLength(5);
    });
  });
}); 