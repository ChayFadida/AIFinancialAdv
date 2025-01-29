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
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReactMarkdown from "react-markdown";
import { getQRReport, getProgressItems } from "../../features/report";
import { getFinanceData } from "../../features/finance";
import company_symbol from "../../utils/company_symbol.json";
import Autocomplete from "@mui/material/Autocomplete";

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
  recommendation: "Buy" | "Sell" | "Hold";
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
    sentiment: "positive" | "negative" | "neutral";
  }[];
}

export interface RequestProgress {
  reportName: string;
  status: "done" | "in_progress";
}
const Recommendation: React.FC = () => {
  const [stockName, setStockName] = React.useState("");
  const [companyName, setCompanyName] = React.useState("");
  const [analysisType, setAnalysisType] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openStockNotValidSnackbar, setOpenStockNotValidSnackbar] =
    React.useState(false);
  const [recommendations, setRecommendations] = React.useState<StockReport[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const [history, setHistory] = React.useState<RecommendationHistory[]>([]);
  const [showGeneratingAlert, setShowGeneratingAlert] = React.useState(false);
  const [progressItems, setProgressItems] = React.useState<RequestProgress[]>(
    []
  );

  const fetchProgressItems = async () => {
    const response = await getProgressItems();
    setProgressItems(response.data); // Extract data from the response object
  };

  React.useEffect(() => {
    fetchProgressItems();
  }, []);
  const generateReport = async (
    stockName: string,
    analysisType: string
  ): Promise<StockReport | null> => {
    const response = await getQRReport(stockName, analysisType);

    if (response.status === 201 || response.status === 202) {
      setShowGeneratingAlert(true);
      return null;
    }

    const analysis_data = response.data.analysis_data;
    const financeData = await getFinanceData(stockName);

    return {
      ...response.data,
      stockName,
      analysisType,
      financeData,
      date: new Date().toISOString(),
      recommendation: "Buy",
      confidence: analysis_data.score,
      currentPrice: 175.34,
      targetPrice: 210.5,
      summary: analysis_data.summary,
      keyMetrics: [
        { label: "Revenue Growth", value: financeData.totalRevenue },
        { label: "Profit Margin", value: financeData.profitMargins },
        { label: "Cash Flow", value: financeData.freeCashFlow },
        { label: "P/E Ratio", value: financeData.currentRatio },
      ],
      analysisPoints: [
        {
          title: "Industry Trends and Market Position",
          content: analysis_data.market_position,
          sentiment: "positive",
        },
        {
          title: "Valuation of the Company",
          content: analysis_data.valuation,
          sentiment: "positive",
        },
        {
          title: "Risk Factors",
          content: analysis_data.risk,
          sentiment: "negative",
        },
        {
          title: "Company Growth",
          content: analysis_data.growth,
          sentiment: "neutral",
        },
      ],
    };
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    const isCompanyStock = company_symbol.some(
      (option) => option.company === companyName
    );

    if (!isCompanyStock) {
      // Show error alert or Snackbar
      setOpenStockNotValidSnackbar(true);
      setIsLoading(false);
      return;
    }
    const reportTypeMapping: Record<string, string> = {
      "qk_report": "Quarterly & Yearly Report",
      "both": "Both Method Report",
      "web_report": "Latest News Report",
    };
    const newRecommendation = await generateReport(stockName, analysisType);
    setProgressItems([...progressItems, { reportName: `${company_symbol.find((option) => option.stock_symbol === stockName)?.company} ${reportTypeMapping[analysisType]}`, status: "in_progress" }]);
    if (newRecommendation) {
      setRecommendations([newRecommendation, ...recommendations]);

      const historyItem: RecommendationHistory = {
        id: Date.now().toString(),
        stockName,
        analysisType,
        date: new Date().toISOString().split("T")[0],
      };
      setHistory([historyItem, ...history]);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    setIsLoading(false);
  };

  const handleCloseGeneratingAlert = () => {
    setShowGeneratingAlert(false);
    // Reset form
    setStockName("");
    setAnalysisType("");
  };

  const handleHistoryClick = (item: RecommendationHistory) => {
    setStockName(item.stockName);
    setAnalysisType(item.analysisType);
  };

  const handleDeleteHistory = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setHistory(history.filter((item) => item.id !== id));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#4caf50";
      case "negative":
        return "#f44336";
      default:
        return "#ff9800";
    }
  };

  const getStatusStyle = (status: string) => {
    const styles = {
      done: {
        color: "#1a7f37",
        bgcolor: "rgba(31, 136, 61, 0.15)",
      },
      in_progress: {
        color: "#9e6a03",
        bgcolor: "rgba(201, 139, 24, 0.15)",
      },
    };
    return styles[status as keyof typeof styles] || styles.in_progress;
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: "auto" }}>
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          bgcolor: "#0c1014",
          minHeight: "600px",
        }}
      >
        {/* Request Progress Sidebar */}
        <Box
          sx={{
            width: 400,
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            bgcolor: "#0c1014",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
            Request Progress
          </Typography>
          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)", mb: 2 }} />
          <List>
            {progressItems.map((item, index) => (
              <ListItem
                key={index}
                sx={{
                  mb: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.05)",
                  borderRadius: 1,
                  display: "block",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.95rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.reportName.split(" ")[0]}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.95rem",
                        lineHeight: 1.2,
                      }}
                    >
                      {item.reportName.split(" ").slice(1).join(" ")}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      ...getStatusStyle(item.status),
                      fontSize: "0.8rem",
                      ml: 2,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "2em",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.status === "done" ? "Done" : "In Progress"}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* History Sidebar */}
        <Box
          sx={{
            width: 260,
            borderRight: "1px solid rgba(255, 255, 255, 0.12)",
            bgcolor: "#0c1014",
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#fff" }}>
            Recommendation History
          </Typography>
          <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.12)" }} />
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
                      color: "rgba(255, 255, 255, 0.7)",
                      "&:hover": { color: "#ff4444" },
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => handleHistoryClick(item)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.stockName}
                    secondary={`${item.analysisType} • ${item.date}`}
                    primaryTypographyProps={{ sx: { color: "#fff" } }}
                    secondaryTypographyProps={{
                      sx: { color: "rgba(255, 255, 255, 0.7)" },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            maxWidth: "800px",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "#fff",
                mb: 4,
              }}
            >
              AI Stock Recommendation
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 6,
                color: "rgba(255, 255, 255, 0.7)",
              }}
            >
              Get personalized stock recommendations from our AI-powered
              financial advisor based on Quarterly Reports, Latest News, or
              both. Simply enter a stock name and select your preferred analysis
              method below.
            </Typography>

            <Autocomplete
              id="stock-name-autocomplete"
              options={company_symbol.map((option) => option.company)} // Options are the company names
              value={companyName}
              onInputChange={(event, newInputValue) => {
                setCompanyName(newInputValue);

                // Find the company symbol that matches the new input value
                const matchedCompany = company_symbol.find(
                  (option) => option.company === newInputValue
                );

                // If a match is found, set the stockName accordingly
                if (matchedCompany) {
                  setStockName(matchedCompany.stock_symbol); // Assuming 'symbol' is the key for the stock symbol
                } else {
                  setStockName(""); // You can set an empty string or a default value if no match is found
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stock Name"
                  fullWidth
                  sx={{
                    mb: 6,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.4)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255, 255, 255, 0.7)",
                    },
                  }}
                />
              )}
            />

            <RadioGroup
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              sx={{ mb: 6 }}
            >
              <FormControlLabel
                value="qk_report"
                control={
                  <Radio
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                }
                label="Quarterly Reports"
                sx={{ color: "#fff" }}
              />
              <FormControlLabel
                value="web_report"
                control={
                  <Radio
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                }
                label="Latest News"
                sx={{ color: "#fff" }}
              />
              <FormControlLabel
                value="both"
                control={
                  <Radio
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-checked": {
                        color: "#2196f3",
                      },
                    }}
                  />
                }
                label="Both"
                sx={{ color: "#fff" }}
              />
            </RadioGroup>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: "auto",
            }}
          >
            <Button
              variant="contained"
              disableElevation
              onClick={handleGenerate}
              disabled={!stockName || !analysisType || isLoading}
              sx={{
                bgcolor: "#2196f3",
                color: "#fff",
                py: 1.5,
                px: 4,
                "&:hover": {
                  bgcolor: "#1976d2",
                },
                "&.Mui-disabled": {
                  bgcolor: "rgba(255, 255, 255, 0.12)",
                  color: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              {isLoading ? "Generating..." : "Generate Recommendation"}
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
                bgcolor: "#1a1a1a",
                color: "#fff",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h5">
                  {report.stockName} Analysis Report
                </Typography>
                <Chip
                  label={report.recommendation}
                  color={
                    report.recommendation === "Buy"
                      ? "success"
                      : report.recommendation === "Sell"
                        ? "error"
                        : "warning"
                  }
                  sx={{ fontSize: "1.1rem", px: 2 }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
                >
                  Confidence Score: {report.confidence}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={report.confidence}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(255, 255, 255, 0.12)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor:
                        report.confidence > 70
                          ? "#4caf50"
                          : report.confidence > 40
                            ? "#ff9800"
                            : "#f44336",
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                >
                  <ReactMarkdown className="prose">
                    {report.summary}
                  </ReactMarkdown>
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Key Metrics
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 3,
                  }}
                >
                  {report.keyMetrics.map((metric, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.05)",
                        p: 2,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                      >
                        {metric.label}
                      </Typography>
                      <Typography variant="h6">{metric.value}</Typography>
                      {!!metric.change && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {metric.change > 0 ? (
                            <TrendingUpIcon color="success" />
                          ) : (
                            <TrendingDownIcon color="error" />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: metric.change > 0 ? "#4caf50" : "#f44336",
                            }}
                          >
                            {Math.abs(metric.change)}%
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>
                  Detailed Analysis
                </Typography>
                {report.analysisPoints.map((point, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderLeft: `4px solid ${getSentimentColor(point.sentiment)}`,
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {point.title}
                    </Typography>
                    <ReactMarkdown className="prose">
                      {point.content}
                    </ReactMarkdown>
                  </Box>
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={showGeneratingAlert}
        onClose={handleCloseGeneratingAlert}
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            color: "#fff",
          },
        }}
      >
        <DialogContent>
          <Alert
            severity="info"
            onClose={handleCloseGeneratingAlert}
            sx={{
              bgcolor: "rgba(33, 150, 243, 0.1)",
              color: "#fff",
              "& .MuiAlert-icon": {
                color: "#2196f3",
              },
            }}
          >
            <AlertTitle>Report Generation in Progress</AlertTitle>
            We are currently generating a new report for this stock. This
            process may take up to an hour. Please try again later.
          </Alert>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="Analyzing stock data. This may take a few moments..."
        sx={{
          "& .MuiSnackbarContent-root": {
            bgcolor: "#2f2f2f",
            color: "#fff",
          },
        }}
      />
      <Snackbar
        open={openStockNotValidSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenStockNotValidSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenStockNotValidSnackbar(false)}
          severity="error"
        >
          Invalid stock name. Please select a valid company.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Recommendation;
