import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import CardTwitter from 'src/views/cards/CardTwitter';
import CardFacebook from 'src/views/cards/CardFacebook';
import { getUserAccounts } from '../../service/User';
import { createAccount} from '../../service/Account';
import swal from 'sweetalert2';

const CreateAccountForm = ({ title }) => {
  const [values, setValues] = useState({
    accountName: '',
    currency: 'EUR',
    accountType: '',
    term: '',
    withdrawalAccountId: undefined, // Yeni alan: Para çekme hesabının ID'si
  });
  const [userAccounts, setUserAccounts] = useState([]); // Kullanıcının mevcut hesaplarının listesi

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await getUserAccounts(userId);
        setUserAccounts(response.data);
      } catch (error) {
        console.error('Error fetching user accounts:', error);
      }
    };

    fetchUserAccounts();
  }, []);

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const renderAdditionalFields = () => {
    switch (values.accountType) {
      case 'Deposit':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Term (months)'
                placeholder='Enter term'
                value={values.term}
                onChange={handleChange('term')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  label='Withdrawal Account'
                  value={values.withdrawalAccountId || ''}
                  onChange={handleChange('withdrawalAccountId')}
                >
                  {userAccounts && userAccounts.map(account => (
                    <MenuItem key={account.id} value={account.accountID}>{account.accountName}</MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ marginLeft: 0 }}>Withdrawal Account</FormHelperText>
              </FormControl>
            </Grid>
          </>
        );
      case 'Savings':
        return null;
      }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createAccount(values, values.accountType);
      // Başarılı hesap oluşturma durumunda kullanıcıya bilgi mesajı gösterilebilir
      swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Account created successfully',
      });
      document.querySelector('.swal2-container').style.zIndex = 9999;
      // Formu sıfırla
      setValues({
        accountName: '',
        currency: 'EUR',
        accountType: '',
        term: ''
      });
    } catch (error) {
      // Hata durumunda kullanıcıya hata mesajı gösterilebilir
      swal.fire({
        
        icon: 'error',
        title: 'Error',
        text: 'Failed to create account',
      });
    }
  };
  

  return (
    <Card>
      <CardHeader
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  label='Account Type'
                  value={values.accountType}
                  onChange={handleChange('accountType')}
                  startIcon={<AccountBalanceIcon />}
                  endIcon={<ArrowDropDownIcon />}
                >
                  <MenuItem value={'Deposit'}>Deposit</MenuItem>
                  <MenuItem value={'Withdrawal'}>Withdrawal</MenuItem>
                  <MenuItem value={'Savings'}>Savings</MenuItem>
                  <MenuItem value={'Retirement'}>Retirement</MenuItem>
                </Select>
                <FormHelperText sx={{ marginLeft: 0 }}>Account Type</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Account Name'
                placeholder='Enter account name'
                value={values.accountName}
                onChange={handleChange('accountName')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Select
                  value={values.currency}
                  onChange={handleChange('currency')}
                  startIcon={<AccountBalanceIcon />}
                  endIcon={<ArrowDropDownIcon />}
                >
                  <MenuItem  value={'EUR'}>EUR</MenuItem>
                  <MenuItem value={'USD'}>USD</MenuItem>
                  <MenuItem value={'TL'}>TL</MenuItem>
                </Select>
                <FormHelperText sx={{ marginLeft: 0 }}>Currency</FormHelperText>
              </FormControl>
              {values.accountType === 'Deposit' &&  (
        <CardTwitter></CardTwitter>
      )}
      {values.accountType === 'Savings' &&  (
        <CardFacebook></CardFacebook>
      )}
            </Grid>
            {renderAdditionalFields()}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='submit' variant='contained' startIcon={<AccountBalanceIcon />} onClick={handleSubmit}>
                  Create Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAccountForm;