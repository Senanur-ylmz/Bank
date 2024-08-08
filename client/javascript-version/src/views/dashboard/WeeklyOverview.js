// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import React, { useState, useEffect } from 'react';

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { getWeeklyTransactions } from '../../service/Transaction';

const WeeklyOverview = () => {
  // ** Hook
  const theme = useTheme();
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    if (weeklyData.length === 0) {
      const fetchWeeklyData = async () => {
        try {
          const response = await getWeeklyTransactions(); // Haftalık verileri çağırma fonksiyonu
          setWeeklyData(response);
        } catch (error) {
          console.error('Error fetching weekly data:', error);
        }
      };
  
      fetchWeeklyData();
    }
  }, [weeklyData]);

  
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.background.default,
      theme.palette.primary.main,
      theme.palette.background.default,
      theme.palette.background.default
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      tickPlacement: 'on',
      labels: { show: false },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value}k`
      }
    }
  }
  const weeklyMoneyFlow = Array.isArray(weeklyData) ? weeklyData.reduce((total, amount) => total + parseFloat(amount), 0).toFixed(2) : 0;

  return (
    <Card>
      <CardHeader
        title='Weekly Overview'
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            
          </IconButton>
        }
      />
      <CardContent sx={{ '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 } }}>
      {weeklyData.length > 0 && (
          <ReactApexcharts
            type='bar'
            height={205}
            options={options}
            series={[{ name: 'Today total money flow', data: [weeklyData[0], weeklyData[1], weeklyData[2], weeklyData[3], weeklyData[4], weeklyData[5], weeklyData[6]] }]}
          />
        )}
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            Total:
          </Typography>
          <Typography variant='body2'>Your weekly money flow is ${weeklyMoneyFlow}.</Typography>
        </Box>
        <Button href='pages/transaction_history' fullWidth variant='contained'>
          Details
        </Button>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
