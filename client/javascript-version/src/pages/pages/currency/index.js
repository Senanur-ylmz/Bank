import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const CurrencyPage = () => {
  const [currencyRates, setCurrencyRates] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        const rates = await getCurrencyRates();
        setCurrencyRates(rates);
        // Otomatik olarak ilk para birimini seç
        if (Object.keys(rates).length > 0) {
          setSelectedCurrency(Object.keys(rates)[0]);
        }
      } catch (error) {
        console.error('Error fetching currency rates:', error);
      }
    };

    fetchCurrencyRates();
  }, []);

  const handleConvert = () => {
    if (amount <= 0) {
      // Amount geçersizse hata göster
      alert('Geçersiz miktar!');
      return;
    }

    if (!currencyRates[selectedCurrency]) {
      // Seçili para birimi geçerli değilse hata göster
      alert('Geçersiz para birimi!');
      return;
    }

    // Dönüştürülen miktarı hesapla
    const convertedAmount = amount * currencyRates[selectedCurrency];

    // Sonucu göster
    alert(`${amount} ${selectedCurrency} = ${convertedAmount} TRY`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Currency Converter
        </Typography>
        <Grid item xs={12} md={6} lg={4}>
          <Grid container spacing={6}>
          </Grid>
        </Grid>
        <Select
          value={selectedCurrency}
          onChange={(event) => setSelectedCurrency(event.target.value)}
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {Object.keys(currencyRates).map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(event) => setAmount(parseFloat(event.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleConvert}>
          Convert
        </Button>
      </Paper>
    </Box>
  );
};

export default CurrencyPage;
