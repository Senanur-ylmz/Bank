import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TableCollapsible from 'src/views/tables/TableTransaction';
import FormLayoutsBasic from 'src/views/form-layouts/FormLayoutsBasic'; // FormLayoutsBasic bileşenini kullanacağız


const AccountPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const openForm = (account) => {
    setSelectedAccount(account);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setSelectedAccount(null);
    setIsFormOpen(false);
  };

  const openNewAccountModal = () => {
    setIsNewAccountModalOpen(true);
  };

  const closeNewAccountModal = () => {
    setIsNewAccountModalOpen(false);
  };

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='#' onClick={() => setIsFormOpen(false)}>Transaction</Link>
        </Typography>
        <Typography variant='body2'>Transaction History</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transaction History' titleTypographyProps={{ variant: 'h6' }} />
          <TableCollapsible onEdit={openForm} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default AccountPage;
