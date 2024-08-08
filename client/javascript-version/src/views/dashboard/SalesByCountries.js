import { useState, useEffect } from 'react';
import { getAllCurrencyRates } from '../../service/CurrencyRates';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical';

const SalesByCountries = () => {
  const [currencyRates, setCurrencyRates] = useState([]);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const response = await getAllCurrencyRates();
        // Sadece ilk 5 öğeyi al
        setCurrencyRates(response.slice(0, 5));
        console.log(currencyRates);
      } catch (error) {
        console.error('Error fetching currency rates:', error);
      }
    };

    fetchCurrencyRates();
  }, []);

  return (
    <Card sx={{ width: '100%' }}>
      <CardHeader
        title='Currency Rates'
        titleTypographyProps={{ sx: { lineHeight: '1.2 !important', letterSpacing: '0.31px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
           
          </IconButton>
        }
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
        {currencyRates && currencyRates.length > 0 && currencyRates.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.12)',
              padding: '10px 0',
              width: '100%' // Tablonun tam genişlikte olmasını sağlar
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}> {/* İçerik yarısını kaplayacak */}
              <Avatar
                sx={{
                  width: 39,
                  height: 39,
                  marginRight: 3,
                  fontSize: '1rem',
                  color: 'common.white',
                  backgroundColor: 'primary.main'
                }}
              >
                {item.ChangeDirection === 'caret-up' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </Avatar>
              <Typography variant='h6'>{item.CurrencyCode}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%', justifyContent: 'flex-end' }}> {/* İçerik yarısını kaplayacak */}
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold', marginRight: 1 }}>{item.SaleRate}</Typography>
              <Typography variant='subtitle1'>{item.PurchaseRate}</Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}

export default SalesByCountries;
