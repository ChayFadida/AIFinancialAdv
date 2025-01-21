// import * as React from "react";
// import { 
//   Box, 
//   Typography, 
//   TextField, 
//   RadioGroup, 
//   FormControlLabel, 
//   Radio, 
//   Button, 
//   Snackbar,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemButton,
//   ListItemSecondaryAction,
//   IconButton,
//   Divider,
//   Chip,
//   LinearProgress,
// } from "@mui/material";
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import TimelineIcon from '@mui/icons-material/Timeline';

// interface RecommendationHistory {
//   id: string;
//   stockName: string;
//   analysisType: string;
//   date: string;
// }

// interface StockReport {
//   stockName: string;
//   analysisType: string;
//   date: string;
//   recommendation: 'Buy' | 'Sell' | 'Hold';
//   confidence: number;
//   currentPrice: number;
//   targetPrice: number;
//   summary: string;
//   keyMetrics: {
//     label: string;
//     value: string;
//     change: number;
//   }[];
//   analysisPoints: {
//     title: string;
//     content: string;
//     sentiment: 'positive' | 'negative' | 'neutral';
//   }[];
// }

// const Recommendation: React.FC = () => {
//   const [stockName, setStockName] = React.useState("");
//   const [analysisType, setAnalysisType] = React.useState("");
//   const [openSnackbar, setOpenSnackbar] = React.useState(false);
//   const [recommendations, setRecommendations] = React.useState<StockReport[]>([]);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const resultRef = React.useRef<HTMLDivElement>(null);
  
//   const [history, setHistory] = React.useState<RecommendationHistory[]>([
//     {
//       id: "1",
//       stockName: "AAPL",
//       analysisType: "Quarterly Reports",
//       date: "2024-03-20"
//     },
//     {
//       id: "2",
//       stockName: "GOOGL",
//       analysisType: "Both",
//       date: "2024-03-19"
//     },
//   ]);

//   const generateFakeReport = (stockName: string, analysisType: string): StockReport => {
//     return {
//       stockName,
//       analysisType,
//       date: new Date().toISOString(),
//       recommendation: 'Buy',
//       confidence: 85,
//       currentPrice: 175.34,
//       targetPrice: 210.50,
//       summary: `Based on our comprehensive analysis of ${stockName}, we observe strong fundamental indicators and positive market sentiment. The company shows robust financial health with increasing revenue streams and effective cost management.`,
//       keyMetrics: [
//         { label: 'Revenue Growth', value: '$96.7B', change: 8.1 },
//         { label: 'Profit Margin', value: '25.3%', change: 2.4 },
//         { label: 'Cash Flow', value: '$24.3B', change: 5.7 },
//         { label: 'P/E Ratio', value: '28.5', change: -1.2 }
//       ],
//       analysisPoints: [
//         {
//           title: 'Financial Performance',
//           content: 'Strong quarterly results with revenue exceeding expectations by 12%. Consistent profit margin improvement observed.',
//           sentiment: 'positive'
//         },
//         {
//           title: 'Market Position',
//           content: 'Leading market share in key segments with expanding global presence. New product launches expected to drive growth.',
//           sentiment: 'positive'
//         },
//         {
//           title: 'Risk Factors',
//           content: 'Potential supply chain disruptions and increasing competition in emerging markets may impact short-term performance.',
//           sentiment: 'negative'
//         },
//         {
//           title: 'Innovation Pipeline',
//           content: 'Robust R&D investments with several promising products in development stages.',
//           sentiment: 'positive'
//         }
//       ]
//     };
//   };

//   const handleGenerate = async () => {
//     setIsLoading(true);
//     setOpenSnackbar(true);
    
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     const newRecommendation = generateFakeReport(stockName, analysisType);
//     setRecommendations([newRecommendation, ...recommendations]);
    
//     // Add to history
//     const historyItem: RecommendationHistory = {
//       id: Date.now().toString(),
//       stockName,
//       analysisType,
//       date: new Date().toISOString().split('T')[0]
//     };
//     setHistory([historyItem, ...history]);
    
//     setIsLoading(false);

//     // Smooth scroll to results
//     setTimeout(() => {
//       resultRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const handleHistoryClick = (item: RecommendationHistory) => {
//     setStockName(item.stockName);
//     setAnalysisType(item.analysisType);
//   };

//   const handleDeleteHistory = (id: string, event: React.MouseEvent) => {
//     event.stopPropagation();
//     setHistory(history.filter(item => item.id !== id));
//   };

//   const getSentimentColor = (sentiment: string) => {
//     switch (sentiment) {
//       case 'positive':
//         return '#4caf50';
//       case 'negative':
//         return '#f44336';
//       default:
//         return '#ff9800';
//     }
//   };
//   return (
//     <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
//       <Paper elevation={3} sx={{ display: 'flex', bgcolor: '#0c1014' }}>
//         {/* History Sidebar */}
//         <Box sx={{ 
//           width: 260, 
//           borderRight: '1px solid rgba(255, 255, 255, 0.12)',
//           bgcolor: '#0c1014',
//           p: 2
//         }}>
//           <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
//             Recommendation History
//           </Typography>
//           <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
//           <List>
//             {history.map((item) => (
//               <ListItem 
//                 key={item.id} 
//                 disablePadding
//                 secondaryAction={
//                   <IconButton 
//                     edge="end" 
//                     onClick={(e) => handleDeleteHistory(item.id, e)}
//                     sx={{ 
//                       color: 'rgba(255, 255, 255, 0.7)',
//                       '&:hover': { color: '#ff4444' }
//                     }}
//                   >
//                     <DeleteOutlineIcon />
//                   </IconButton>
//                 }
//               >
//                 <ListItemButton 
//                   onClick={() => handleHistoryClick(item)}
//                   sx={{ 
//                     '&:hover': { 
//                       backgroundColor: 'rgba(255, 255, 255, 0.08)' 
//                     }
//                   }}
//                 >
//                   <ListItemText
//                     primary={item.stockName}
//                     secondary={`${item.analysisType} • ${item.date}`}
//                     primaryTypographyProps={{ sx: { color: '#fff' } }}
//                     secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>
//         </Box>

//         {/* Main Content */}
//         <Box sx={{ flexGrow: 1, p: 4 }}>
//           <Typography variant="h4" gutterBottom sx={{ color: '#fff' }}>
//             AI Stock Recommendation
//           </Typography>
          
//           <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.7)' }}>
//             Get personalized stock recommendations from our AI-powered financial advisor based on 
//             Quarterly Reports, Latest News, or both. Simply enter a stock name and select your 
//             preferred analysis method below.
//           </Typography>

//           <TextField
//             fullWidth
//             label="Stock Name"
//             value={stockName}
//             onChange={(e) => setStockName(e.target.value)}
//             sx={{ 
//               mb: 4,
//               '& .MuiOutlinedInput-root': {
//                 color: '#fff',
//                 '& fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.23)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(255, 255, 255, 0.4)',
//                 },
//               },
//               '& .MuiInputLabel-root': {
//                 color: 'rgba(255, 255, 255, 0.7)',
//               },
//             }}
//           />

//           <RadioGroup
//             value={analysisType}
//             onChange={(e) => setAnalysisType(e.target.value)}
//             sx={{ mb: 4 }}
//           >
//             <FormControlLabel 
//               value="quarterly" 
//               control={
//                 <Radio 
//                   sx={{ 
//                     color: 'rgba(255, 255, 255, 0.7)',
//                     '&.Mui-checked': {
//                       color: '#2196f3',
//                     }
//                   }} 
//                 />
//               } 
//               label="Quarterly Reports"
//               sx={{ color: '#fff' }}
//             />
//             <FormControlLabel 
//               value="news" 
//               control={
//                 <Radio 
//                   sx={{ 
//                     color: 'rgba(255, 255, 255, 0.7)',
//                     '&.Mui-checked': {
//                       color: '#2196f3',
//                     }
//                   }} 
//                 />
//               } 
//               label="Latest News"
//               sx={{ color: '#fff' }}
//             />
//             <FormControlLabel 
//               value="both" 
//               control={
//                 <Radio 
//                   sx={{ 
//                     color: 'rgba(255, 255, 255, 0.7)',
//                     '&.Mui-checked': {
//                       color: '#2196f3',
//                     }
//                   }} 
//                 />
//               } 
//               label="Both"
//               sx={{ color: '#fff' }}
//             />
//           </RadioGroup>

//           <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//             <Button 
//               variant="contained" 
//               disableElevation
//               onClick={handleGenerate}
//               disabled={!stockName || !analysisType || isLoading}
//               sx={{
//                 bgcolor: '#2196f3',
//                 color: '#fff',
//                 '&:hover': {
//                   bgcolor: '#1976d2',
//                 },
//                 '&.Mui-disabled': {
//                   bgcolor: 'rgba(255, 255, 255, 0.12)',
//                   color: 'rgba(255, 255, 255, 0.3)',
//                 }
//               }}
//             >
//               {isLoading ? 'Generating...' : 'Generate Recommendation'}
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Results Section */}
//       {recommendations.length > 0 && (
//         <Box ref={resultRef} sx={{ mt: 4 }}>
//           {recommendations.map((report, index) => (
//             <Paper 
//               key={index} 
//               elevation={3} 
//               sx={{ 
//                 p: 4, 
//                 mb: 2, 
//                 bgcolor: '#1a1a1a',
//                 color: '#fff' 
//               }}
//             >
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h5">
//                   {report.stockName} Analysis Report
//                 </Typography>
//                 <Chip 
//                   label={report.recommendation}
//                   color={report.recommendation === 'Buy' ? 'success' : report.recommendation === 'Sell' ? 'error' : 'warning'}
//                   sx={{ fontSize: '1.1rem', px: 2 }}
//                 />
//               </Box>

//               <Box sx={{ mb: 4 }}>
//                 <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
//                   Confidence Score: {report.confidence}%
//                 </Typography>
//                 <LinearProgress 
//                   variant="determinate" 
//                   value={report.confidence}
//                   sx={{ 
//                     height: 8, 
//                     borderRadius: 4,
//                     bgcolor: 'rgba(255, 255, 255, 0.12)',
//                     '& .MuiLinearProgress-bar': {
//                       bgcolor: report.confidence > 70 ? '#4caf50' : report.confidence > 40 ? '#ff9800' : '#f44336'
//                     }
//                   }}
//                 />
//               </Box>

//               <Box sx={{ mb: 4 }}>
//                 <Typography variant="h6" gutterBottom>Summary</Typography>
//                 <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                   {report.summary}
//                 </Typography>
//               </Box>

//               <Box sx={{ mb: 4 }}>
//                 <Typography variant="h6" gutterBottom>Key Metrics</Typography>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
//                   {report.keyMetrics.map((metric, idx) => (
//                     <Box key={idx} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', p: 2, borderRadius: 1 }}>
//                       <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                         {metric.label}
//                       </Typography>
//                       <Typography variant="h6">
//                         {metric.value}
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                         {metric.change > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
//                         <Typography 
//                           variant="body2"
//                           sx={{ 
//                             color: metric.change > 0 ? '#4caf50' : '#f44336'
//                           }}
//                         >
//                           {Math.abs(metric.change)}%
//                         </Typography>
//                       </Box>
//                     </Box>
//                   ))}
//                 </Box>
//               </Box>

//               <Box>
//                 <Typography variant="h6" gutterBottom>Detailed Analysis</Typography>
//                 {report.analysisPoints.map((point, idx) => (
//                   <Box 
//                     key={idx} 
//                     sx={{ 
//                       mb: 2,
//                       p: 2,
//                       borderLeft: `4px solid ${getSentimentColor(point.sentiment)}`,
//                       bgcolor: 'rgba(255, 255, 255, 0.05)',
//                     }}
//                   >
//                     <Typography variant="subtitle1" gutterBottom>
//                       {point.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
//                       {point.content}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Paper>
//           ))}
//         </Box>
//       )}

//       <Snackbar
//         open={openSnackbar}
//         autoHideDuration={6000}
//         onClose={() => setOpenSnackbar(false)}
//         message="Analyzing stock data. This may take a few moments..."
//         sx={{
//           '& .MuiSnackbarContent-root': {
//             bgcolor: '#2f2f2f',
//             color: '#fff',
//           }
//         }}
//       />
//     </Box>
//   );
// };

// export default Recommendation;

import * as React from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Button, 
  Snackbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  IconButton,
  Divider,
  Chip,
  LinearProgress,
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface RecommendationHistory {
  id: string;
  stockName: string;
  analysisType: string;
  date: string;
}

interface StockReport {
  stockName: string;
  analysisType: string;
  date: string;
  recommendation: 'Buy' | 'Sell' | 'Hold';
  confidence: number;
  currentPrice: number;
  targetPrice: number;
  summary: string;
  keyMetrics: {
    label: string;
    value: string;
    change: number;
  }[];
  analysisPoints: {
    title: string;
    content: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }[];
}

const Recommendation: React.FC = () => {
  const [stockName, setStockName] = React.useState("");
  const [analysisType, setAnalysisType] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [recommendations, setRecommendations] = React.useState<StockReport[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);
  
  const [history, setHistory] = React.useState<RecommendationHistory[]>([
    {
      id: "1",
      stockName: "AAPL",
      analysisType: "Quarterly Reports",
      date: "2024-03-20"
    },
    {
      id: "2",
      stockName: "GOOGL",
      analysisType: "Both",
      date: "2024-03-19"
    },
  ]);
  const generateFakeReport = (stockName: string, analysisType: string): StockReport => {
    return {
      stockName,
      analysisType,
      date: new Date().toISOString(),
      recommendation: 'Buy',
      confidence: 85,
      currentPrice: 175.34,
      targetPrice: 210.50,
      summary: `Based on our comprehensive analysis of ${stockName}, we observe strong fundamental indicators and positive market sentiment. The company shows robust financial health with increasing revenue streams and effective cost management.`,
      keyMetrics: [
        { label: 'Revenue Growth', value: '$96.7B', change: 8.1 },
        { label: 'Profit Margin', value: '25.3%', change: 2.4 },
        { label: 'Cash Flow', value: '$24.3B', change: 5.7 },
        { label: 'P/E Ratio', value: '28.5', change: -1.2 }
      ],
      analysisPoints: [
        {
          title: 'Financial Performance',
          content: 'Strong quarterly results with revenue exceeding expectations by 12%. Consistent profit margin improvement observed.',
          sentiment: 'positive'
        },
        {
          title: 'Market Position',
          content: 'Leading market share in key segments with expanding global presence. New product launches expected to drive growth.',
          sentiment: 'positive'
        },
        {
          title: 'Risk Factors',
          content: 'Potential supply chain disruptions and increasing competition in emerging markets may impact short-term performance.',
          sentiment: 'negative'
        },
        {
          title: 'Innovation Pipeline',
          content: 'Robust R&D investments with several promising products in development stages.',
          sentiment: 'positive'
        }
      ]
    };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setOpenSnackbar(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRecommendation = generateFakeReport(stockName, analysisType);
    setRecommendations([newRecommendation, ...recommendations]);
    
    // Add to history
    const historyItem: RecommendationHistory = {
      id: Date.now().toString(),
      stockName,
      analysisType,
      date: new Date().toISOString().split('T')[0]
    };
    setHistory([historyItem, ...history]);
    
    setIsLoading(false);

    // Smooth scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleHistoryClick = (item: RecommendationHistory) => {
    setStockName(item.stockName);
    setAnalysisType(item.analysisType);
  };

  const handleDeleteHistory = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setHistory(history.filter(item => item.id !== id));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#4caf50';
      case 'negative':
        return '#f44336';
      default:
        return '#ff9800';
    }
  };
  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Paper elevation={3} sx={{ 
        display: 'flex', 
        bgcolor: '#0c1014',
        minHeight: '600px',
      }}>
        {/* History Sidebar */}
        <Box sx={{ 
          width: 260, 
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          bgcolor: '#0c1014',
          p: 2
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
            Recommendation History
          </Typography>
          <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
          <List>
            {history.map((item) => (
              <ListItem 
                key={item.id} 
                disablePadding
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={(e) => handleDeleteHistory(item.id, e)}
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { color: '#ff4444' }
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemButton 
                  onClick={() => handleHistoryClick(item)}
                  sx={{ 
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)' 
                    }
                  }}
                >
                  <ListItemText
                    primary={item.stockName}
                    secondary={`${item.analysisType} • ${item.date}`}
                    primaryTypographyProps={{ sx: { color: '#fff' } }}
                    secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box sx={{ 
          flexGrow: 1, 
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          maxWidth: '800px',
        }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ 
              color: '#fff',
              mb: 4
            }}>
              AI Stock Recommendation
            </Typography>
            
            <Typography variant="body1" sx={{ 
              mb: 6,
              color: 'rgba(255, 255, 255, 0.7)' 
            }}>
              Get personalized stock recommendations from our AI-powered financial advisor based on 
              Quarterly Reports, Latest News, or both. Simply enter a stock name and select your 
              preferred analysis method below.
            </Typography>

            <TextField
              fullWidth
              label="Stock Name"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              sx={{ 
                mb: 6,
                '& .MuiOutlinedInput-root': {
                  color: '#fff',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                },
              }}
            />

            <RadioGroup
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              sx={{ mb: 6 }}
            >
              <FormControlLabel 
                value="quarterly" 
                control={
                  <Radio 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }} 
                  />
                } 
                label="Quarterly Reports"
                sx={{ color: '#fff' }}
              />
              <FormControlLabel 
                value="news" 
                control={
                  <Radio 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }} 
                  />
                } 
                label="Latest News"
                sx={{ color: '#fff' }}
              />
              <FormControlLabel 
                value="both" 
                control={
                  <Radio 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&.Mui-checked': {
                        color: '#2196f3',
                      }
                    }} 
                  />
                } 
                label="Both"
                sx={{ color: '#fff' }}
              />
            </RadioGroup>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 'auto'
          }}>
            <Button 
              variant="contained" 
              disableElevation
              onClick={handleGenerate}
              disabled={!stockName || !analysisType || isLoading}
              sx={{
                bgcolor: '#2196f3',
                color: '#fff',
                py: 1.5,
                px: 4,
                '&:hover': {
                  bgcolor: '#1976d2',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.3)',
                }
              }}
            >
              {isLoading ? 'Generating...' : 'Generate Recommendation'}
            </Button>
          </Box>
        </Box>
      </Paper>
            {/* Results Section */}
            {recommendations.length > 0 && (
        <Box ref={resultRef} sx={{ mt: 4 }}>
          {recommendations.map((report, index) => (
            <Paper 
              key={index} 
              elevation={3} 
              sx={{ 
                p: 4, 
                mb: 2, 
                bgcolor: '#1a1a1a',
                color: '#fff' 
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  {report.stockName} Analysis Report
                </Typography>
                <Chip 
                  label={report.recommendation}
                  color={report.recommendation === 'Buy' ? 'success' : report.recommendation === 'Sell' ? 'error' : 'warning'}
                  sx={{ fontSize: '1.1rem', px: 2 }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
                  Confidence Score: {report.confidence}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={report.confidence}
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.12)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: report.confidence > 70 ? '#4caf50' : report.confidence > 40 ? '#ff9800' : '#f44336'
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {report.summary}
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>Key Metrics</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                  {report.keyMetrics.map((metric, idx) => (
                    <Box key={idx} sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {metric.label}
                      </Typography>
                      <Typography variant="h6">
                        {metric.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {metric.change > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                        <Typography 
                          variant="body2"
                          sx={{ 
                            color: metric.change > 0 ? '#4caf50' : '#f44336'
                          }}
                        >
                          {Math.abs(metric.change)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>Detailed Analysis</Typography>
                {report.analysisPoints.map((point, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      mb: 2,
                      p: 2,
                      borderLeft: `4px solid ${getSentimentColor(point.sentiment)}`,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      {point.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {point.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Analyzing stock data. This may take a few moments..."
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#2f2f2f',
            color: '#fff',
          }
        }}
      />
    </Box>
  );
};

export default Recommendation;