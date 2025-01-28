import { Grid2 as Grid, Typography } from "@mui/material";
import { Card } from "../../components";
import { Price } from "./Price";
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import SouthEastIcon from '@mui/icons-material/SouthEast';



const monthlyIncomeData = [
  { month: 'Jan', income: 4000 },
  { month: 'Feb', income: 4200 },
  { month: 'Mar', income: 4500 },
  { month: 'Apr', income: 4300 },
  { month: 'May', income: 4800 },
  { month: 'Jun', income: 5000 },
  { month: 'Jul', income: 4900 },
  { month: 'Aug', income: 5200 },
  { month: 'Sep', income: 5500 },
  { month: 'Oct', income: 5700 },
  { month: 'Nov', income: 5900 },
  { month: 'Dec', income: 6000 },
];

const progressValue = 75;
const savingValue = 53;
const creditValue = 22;
const stockValue = 2.38;
const stockValue2 = -1.23;
export const Portfolio = () => {
  return (
    <div>
      <Typography variant="h6" mb={2}>
        About
      </Typography>

      <Grid container spacing={3}>
        {/* First row */}
        <Grid size={4}>
          <Card title="Total balance">
            <Price price={1000} change={5.5} />
          </Card>
        </Grid>

        <Grid size={4}>
          <Card title="Total spending">
            <Price price={500} change={-4.3} />
          </Card>
        </Grid>

        <Grid size={4}>
          <Card title="Total amount">
            <Price price={500} />
          </Card>
        </Grid>

      <Grid size={8}>
          <Card title="My income">
            <Price price={1000} change={5.5} />
            <LineChart
                  height={300}
                  width={850}
                  xAxis={[{ 
                    data: monthlyIncomeData.map(item => item.month),
                    scaleType: 'band'
                  }]}
                  series={[
                    {
                      data: monthlyIncomeData.map(item => item.income),
                      curve: "linear",
                      valueFormatter: (value)=> `$${value}`
                    }
                  ]}
            />
          </Card>
        </Grid>
        
        <Grid size={4}>
          
          <Card title="Account Status">
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1, mt: 2}}>
              <span>Saving</span>
              <span style={{ color: savingValue >= 50 ? '#4caf50' : '#ff4444' }}>{`${savingValue}%`}</span>
            </Typography>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <span>Credits</span>
              <span style={{ color: creditValue >= 50 ? '#4caf50' : '#ff4444' }}>{`${creditValue}%`}</span>
            </Typography>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <span> Risk Profile </span>
              <span> Aggresive </span>
            </Typography>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <span> Goal Status </span>
              <progress value={progressValue} max={100} />
              <span>{`${progressValue}%`}</span>
            </Typography>
          </Card>

          <Card title="Hot Stocks now" sx={{ mt: 3 }}>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1, mt: 1}}>
              <span> Stock example #1 </span>
              <span style={{ color: stockValue >= 0 ? '#4caf50' : '#ff4444', display: 'flex', alignItems: 'center' }}>
                {stockValue >= 0 ? 
                  <NorthEastIcon fontSize="small" sx={{ mr: 1 }} /> : 
                  <SouthEastIcon fontSize="small" sx={{ mr: 1 }} />
                }
                {`${stockValue >= 0 ? '+' : ''}${stockValue}%`}
              </span>
            </Typography>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <span> Stock example #2 </span>
              <span style={{ color: stockValue2 >= 0 ? '#4caf50' : '#ff4444', display: 'flex', alignItems: 'center' }}>
                {stockValue2 >= 0 ? 
                  <NorthEastIcon fontSize="small" sx={{ mr: 1 }} /> : 
                  <SouthEastIcon fontSize="small" sx={{ mr: 1 }} />
                }
                {`${stockValue2 >= 0 ? '+' : ''}${stockValue2}%`}
              </span>
            </Typography>
            <Typography sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <span> Stock example #3 </span>
              <span style={{ color: stockValue2 >= 0 ? '#4caf50' : '#ff4444', display: 'flex', alignItems: 'center' }}>
                {stockValue2 >= 0 ? 
                  <NorthEastIcon fontSize="small" sx={{ mr: 1 }} /> : 
                  <SouthEastIcon fontSize="small" sx={{ mr: 1 }} />
                }
                {`${stockValue2 >= 0 ? '+' : ''}${stockValue2}%`}
              </span>
            </Typography>
          </Card>

        </Grid>

      </Grid>

       

    </div>
  );
};
