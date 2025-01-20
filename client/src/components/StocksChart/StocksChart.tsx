import { useEffect, useState } from "react";
import ApexChart, { Props } from "react-apexcharts";

import "./StocksChart.css";
import { Box, CircularProgress } from "@mui/material";

function formatDate(date: string): string {
  // Split the input date into its components (assuming the format is DD-mm-yyyy)
  const [day, month, year] = date.split("-");

  // Return the formatted date as mm-DD-yyyy
  return `${month}-${day}-${year}`;
}

type StocksChartProps = {
  data: {
    date: string;
    close: number;
    high: number;
    low: number;
    open: number;
  }[];
  isLoading?: boolean;
};
export const StocksChart = ({ data, isLoading }: StocksChartProps) => {
  const [chartState, setChartState] = useState<Props>({
    series: [
      {
        data: [],
      },
    ],
    options: {
      tooltip: {
        style: {},
      },
      chart: {
        id: "candlestick",
        height: "90%",
      },
      title: {
        text: "",
        align: "left",
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
    },
  });

  useEffect(() => {
    const formattedData = data.map((item) => ({
      x: new Date(formatDate(item.date)),
      y: [item.open, item.high, item.low, item.close],
    }));

    setChartState((prevState) => ({
      ...prevState,
      series: [
        {
          data: formattedData,
        },
      ],
    }));
  }, [data]);

  return (
    <Box height="100%" position="relative">
      {isLoading && (
        <Box
          sx={{
            background: "#c1c1c117",
            width: "100%",
            height: "100%",
            position: "absolute",
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress color="success" />
          </Box>
        </Box>
      )}
      <ApexChart
        options={chartState.options}
        series={chartState.series}
        type="candlestick"
        height="95%"
      />
    </Box>
  );
};
