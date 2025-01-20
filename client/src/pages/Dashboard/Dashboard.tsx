import { Box, Grid2 as Grid, Typography } from "@mui/material";
import { Card, Select, StocksChart } from "../../components";
import { useEffect, useState } from "react";
import { yahooChartAxios } from "../../services/axios/yahooChartAxios";

const stocks = [
  { id: "AAPL", label: "Apple Inc." },
  { id: "MSFT", label: "Microsoft Corporation" },
  { id: "GOOGL", label: "Alphabet Inc." },
  { id: "AMZN", label: "Amazon.com Inc." },
  { id: "TSLA", label: "Tesla Inc." },
];

export const Dashboard = () => {
  const [currentStock, setCurrentStock] = useState(stocks[0].id);
  const [stockHistory, setStockHistory] = useState([]);
  const [isStockHistoryLoading, setIsStockHistoryLoading] = useState(false);

  const handleStockChange = (stockId: string) => {
    setCurrentStock(stockId);
  };

  useEffect(() => {
    const getStockHistory = async () => {
      try {
        setIsStockHistoryLoading(true);
        const response = await yahooChartAxios.get(`/markets/stock/history`, {
          params: {
            symbol: currentStock,
            interval: "1d",
            diffandsplits: "false",
          },
        });

        setStockHistory(Object.values(response.data.body));
      } catch (error) {
        console.error(error);
      } finally {
        setIsStockHistoryLoading(false);
      }
    };

    getStockHistory();
  }, [currentStock]);

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      <Box mb={10}>
        <Typography variant="h6">Dashboard</Typography>
      </Box>

      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* Second row */}
        <Grid size={12} height="100%" display="flex" flexDirection="column">
          <Card
            title={
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box width="250px">
                  <Select
                    label="Stock"
                    value={currentStock}
                    onChange={handleStockChange}
                    options={stocks}
                  />
                </Box>
              </Box>
            }
            sx={{ flex: 1 }}
          >
            <StocksChart
              data={stockHistory}
              isLoading={isStockHistoryLoading}
            />
          </Card>
        </Grid>
        {/* Second row */}
      </Grid>
    </Box>
  );
};

// import { Box, Grid2 as Grid, Typography } from "@mui/material";
// import { Card, Select, StocksChart } from "../../components";
// import { useEffect, useState } from "react";
// import axios from "axios"; // Import Axios or use your axios instance

// export const Dashboard = () => {
//   const [stocks, setStocks] = useState([]); // Dynamically fetched stocks
//   const [currentStock, setCurrentStock] = useState("");
//   const [stockHistory, setStockHistory] = useState([]);
//   const [isStockHistoryLoading, setIsStockHistoryLoading] = useState(false);

//   // Fetch user's stocks on component mount
//   useEffect(() => {
//     const fetchUserStocks = async () => {
//       try {
//         // Replace with your API endpoint to fetch user details
//         const response = await axios.get("http://localhost:5001/api/user", {
//           withCredentials: true, // Include credentials if needed
//         });

//         const userStocks = response.data.stocks.map((stockId: string) => ({
//           id: stockId,
//           label: stockId, // Label can be enhanced with additional metadata
//         }));

//         setStocks(userStocks);
//         if (userStocks.length > 0) {
//           setCurrentStock(userStocks[0].id); // Set the first stock as default
//         }
//       } catch (error) {
//         console.error("Error fetching user stocks:", error);
//       }
//     };

//     fetchUserStocks();
//   }, []);

//   // Fetch stock history when the selected stock changes
//   useEffect(() => {
//     if (!currentStock) return;

//     const getStockHistory = async () => {
//       try {
//         setIsStockHistoryLoading(true);
//         const response = await axios.get(`/markets/stock/history`, {
//           params: {
//             symbol: currentStock,
//             interval: "1d",
//             diffandsplits: "false",
//           },
//         });

//         setStockHistory(Object.values(response.data.body));
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setIsStockHistoryLoading(false);
//       }
//     };

//     getStockHistory();
//   }, [currentStock]);

//   const handleStockChange = (stockId: string) => {
//     setCurrentStock(stockId);
//   };

//   return (
//     <Box display="flex" flexDirection="column" flex={1}>
//       <Box mb={10}>
//         <Typography variant="h6">Dashboard</Typography>
//       </Box>

//       <Grid container spacing={3} sx={{ flex: 1 }}>
//         {/* Second row */}
//         <Grid size={12} height="100%" display="flex" flexDirection="column">
//           <Card
//             title={
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 alignItems="center"
//               >
//                 <Box width="250px">
//                   <Select
//                     label="Stock"
//                     value={currentStock}
//                     onChange={handleStockChange}
//                     options={stocks}
//                   />
//                 </Box>
//               </Box>
//             }
//             sx={{ flex: 1 }}
//           >
//             <StocksChart
//               data={stockHistory}
//               isLoading={isStockHistoryLoading}
//             />
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };
