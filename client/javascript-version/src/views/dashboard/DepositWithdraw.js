import React, { useEffect, useState } from 'react';
import { getAllTransactions } from '../../service/Transaction';
import { getUserAccounts } from '../../service/User'; // Kullanıcı hesaplarını getiren servis
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import MuiDivider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';

const Divider = styled(MuiDivider)(({ theme }) => ({
  margin: theme.spacing(5, 0),
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('md')]: {
    borderRight: 'none',
    margin: theme.spacing(0, 5),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const DepositWithdraw = () => {
  const [transactions, setTransactions] = useState([]);
  const [accountIDs, setAccountIDs] = useState([]);

  useEffect(() => {
    fetchData();
    fetchUserAccounts();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await getAllTransactions(userId);
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error('Error fetching transactions: Data is not an array');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  

  const fetchUserAccounts = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userData = await getUserAccounts(userId);
      const ids = userData.data.map(account => account.accountID);
      console.log(ids , "bosbu");
      setAccountIDs(ids);
    } catch (error) {
      console.error('Error fetching user accounts:', error);
    }
  };

  const depositData = transactions.filter(transaction => {
    return accountIDs.includes(transaction.receiverAccountID);
  });

  const withdrawData = transactions.filter(transaction => {
    return accountIDs.includes(transaction.senderAccountID);
  });

  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: ['column', 'column', 'row'] }}>
      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Deposit'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
        <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
        {depositData.map((item, index) => {
  const logoComponent = item.transactionType === "Firm Invoice" ? <BusinessIcon /> : <PersonIcon />;
  const altText = item.transactionType === "Firm Invoice" ? "Firm Logo" : "Person Logo";

  return (
    <Box
      key={item.title}
      sx={{ display: 'flex', alignItems: 'center', mb: index !== depositData.length - 1 ? 6 : 0 }}
    >
      <Box sx={{ minWidth: 36, display: 'flex', justifyContent: 'center' }}>
        <IconButton aria-label={altText} size="large">
          {logoComponent}
        </IconButton>
      </Box>
      <Box
        sx={{
          ml: 4,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.transactionType}</Typography>
          <Typography variant='caption'>Alıcı hesap: {item.receiverAccountID}</Typography>
        </Box>
        <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'success.main' }}>
          {item.amount}
        </Typography>
      </Box>
    </Box>
  );
})}
        </CardContent>
      </Box>

      <Divider flexItem />

      <Box sx={{ width: '100%' }}>
        <CardHeader
          title='Withdraw'
          sx={{ pt: 5.5, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}

          titleTypographyProps={{
            variant: 'h6',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
      <CardContent sx={{ pb: theme => `${theme.spacing(5.5)} !important` }}>
      {withdrawData.map((item, index) => {
  const logoComponent = item.transactionType === "Firm Invoice" ? <BusinessIcon /> : <PersonIcon />;
  const altText = item.transactionType === "Firm Invoice" ? "Firm Logo" : "Person Logo";

  return (
    <Box
      key={item.title}
      sx={{ display: 'flex', alignItems: 'center', mb: index !== depositData.length - 1 ? 6 : 0 }}
    >
      <Box sx={{ minWidth: 36, display: 'flex', justifyContent: 'center' }}>
        <IconButton aria-label={altText} size="large">
          {logoComponent}
        </IconButton>
      </Box>
      <Box
        sx={{
          ml: 4,
          width: '100%',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.transactionType}</Typography>
          <Typography variant='caption'>Alıcı hesap: {item.receiverAccountID}</Typography>
        </Box>
        <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'error.main' }}>
          {item.amount}
        </Typography>
      </Box>
    </Box>
  );
})}
        </CardContent>
      </Box>
    </Card>
  );
};

export default DepositWithdraw;
