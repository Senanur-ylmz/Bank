import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import TrendingUp from 'mdi-material-ui/TrendingUp';
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd';
import DotsVertical from 'mdi-material-ui/DotsVertical';
import CellphoneLink from 'mdi-material-ui/CellphoneLink';
import AccountOutline from 'mdi-material-ui/AccountOutline';
import { getInvoiceCount, getAccountCount, getTransactionCount, getRecentTransactions } from '../../service/User'; // İlgili servisleri import ediyoruz
import { TrendingDown } from 'mdi-material-ui';

const StatisticsCard = () => {
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [accountCount, setAccountCount] = useState(0);
  const [transactionCount, setTransactionCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState(0);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // İlgili istatistikleri çağır
        const invoices = await getInvoiceCount();
        const accounts = await getAccountCount();
        const transactions = await getTransactionCount();
        const recent = await getRecentTransactions();

        // Verileri güncelle
        setInvoiceCount(invoices.totalInvoiceNumber);
        setAccountCount(accounts.data);
        setTransactionCount(transactions.data);
        setRecentTransactions(recent.data.toFixed(2));
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    // Component yüklendiğinde istatistikleri getir
    fetchStatistics();
  }, []);

  const renderStats = () => {
    const trendIcon = recentTransactions < 0 ? <TrendingDown sx={{ fontSize: '1.75rem' }} /> : <TrendingUp sx={{ fontSize: '1.75rem' }} />;
  
    return [
      { stats: invoiceCount, title: 'Invoices', color: 'primary', icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} /> },
      { stats: accountCount, title: 'Accounts', color: 'success', icon: <AccountOutline sx={{ fontSize: '1.75rem' }} /> },
      { stats: transactionCount, title: 'Transactions', color: 'warning', icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} /> },
      { stats: recentTransactions, title: 'Recent Activity', color: 'info', icon: trendIcon }
    ].map((item, index) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mb: 6,
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 6}}>
            <Typography variant='caption'>{item.title}</Typography>
            <Typography variant='h6'>{item.stats}</Typography>
          </Box>
        </Box>
      </Grid>
    ));
  };
  

  return (
    <Card>
      <CardHeader
        title='Statistics'
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            
          </IconButton>
        }
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {/* İsteğe bağlı alt başlık */}
            </Box>{' '}
            {/* İsteğe bağlı alt başlık devamı */}
          </Typography>
        }
        titleTypographyProps={{
          sx: {

            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
