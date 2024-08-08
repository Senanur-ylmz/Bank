import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableInvoice from 'src/views/tables/TableInvoice';

const InvoicePage = () => {
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
          <Link href='#' onClick={() => setIsFormOpen(false)}>Talimatlar</Link>
        </Typography>
        <Typography variant='body2'>Talimatlar listesi</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Invoice History' titleTypographyProps={{ variant: 'h6' }} />
          <TableInvoice onEdit={() => {}} /> {/* onEdit fonksiyonunu boş bıraktık */}
        </Card>
      </Grid>
    </Grid>
  );
}

export default InvoicePage;
