import { render, screen } from "@testing-library/react";
import { StocksChart } from "./StocksChart";

// Mock ApexCharts
jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: ({ options, series }: any) => (
    <div
      data-testid="mock-chart"
      data-options={JSON.stringify(options)}
      data-series={JSON.stringify(series)}
    />
  ),
}));

describe("StocksChart Component", () => {
  const mockData = [
    {
      date: "2024-01-01",
      close: 100,
      high: 110,
      low: 90,
      open: 95,
    },
    {
      date: "2024-01-02",
      close: 105,
      high: 115,
      low: 95,
      open: 100,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders chart component with correct data", () => {
    render(<StocksChart data={mockData} />);
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });

  it("shows loading state when isLoading is true", () => {
    const { container } = render(<StocksChart data={[]} isLoading={true} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("does not show loading state when isLoading is false", () => {
    render(<StocksChart data={mockData} isLoading={false} />);
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<StocksChart data={[]} />);
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
  });
});
