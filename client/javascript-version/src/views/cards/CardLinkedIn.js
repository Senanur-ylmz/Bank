import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoneyIcon from '@mui/icons-material/Money';

const InterestRateCard = ({ paymentValue, interestRate }) => {
  const totalAmount = paymentValue + (paymentValue * interestRate / 100);

  return (
    <Card sx={{ border: 0, boxShadow: 0 }}>
      <CardContent sx={{ backgroundColor: 'info.main', color: 'common.white', padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '16px' }}>
          <Avatar alt='' src='/images/interest-rate-icon.png' sx={{ width: 80, height: 80, marginBottom: 2.75 }} />
          <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 1 }}>
            Interest Rate
          </Typography>
          <Typography variant='h4' sx={{ textAlign: 'center', fontSize: 40, marginBottom: 2 }}>
            %{interestRate}
          </Typography>
        </Box>
        <Typography variant='body1' sx={{ display: 'flex', justifyContent: 'center' }}>
          <LocalAtmIcon /> Payment Value: {paymentValue}
        </Typography>
        <Typography variant='body1' sx={{ display: 'flex', justifyContent: 'center' }}>
          <MoneyIcon /> Total Amount: {totalAmount.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InterestRateCard;
