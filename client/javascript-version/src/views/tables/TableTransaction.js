import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { getAllTransactions, getFilteredTransactions, hideTransaction } from '../../service/Transaction';

const Row = ({ transaction, handleHideTransaction }) => {
  return (
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>{transaction.transactionID}</TableCell>
      <TableCell>{transaction.senderAccountID}</TableCell>
      <TableCell>{transaction.receiverAccountID}</TableCell>
      <TableCell>{transaction.amount}</TableCell>
      <TableCell>{transaction.transactionType}</TableCell>
      <TableCell>{transaction.description}</TableCell>
      <TableCell>{transaction.transactionDate}</TableCell>
      <TableCell>
        <IconButton onClick={() => handleHideTransaction(transaction.transactionID)}>
          {transaction.isHide ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await getAllTransactions(userId);
      const visibleTransactions = data.filter(transaction => transaction.isHidden !== 1); // isHidden'in değeri kontrol edilmeli
      setTransactions(visibleTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  const handleFilter = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await getFilteredTransactions(filterType, filterValue, userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error filtering transactions:', error);
    }
  };
  

  const showAllTransactions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await getAllTransactions(userId);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching all transactions:', error);
    }
  };

  const handleHideTransaction = async (transactionID) => {
    try {
      const updatedTransactions = transactions.map(transaction =>
        transaction.transactionID === transactionID ? { ...transaction, isHidden: !transaction.isHidden } : transaction
      );
      setTransactions(updatedTransactions);

      const userId = localStorage.getItem('userId');
      await hideTransaction(userId, transactionID);
    } catch (error) {
      console.error('Error updating transaction visibility:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
        <TextField
          select
          label="Filter Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          <MenuItem value="senderAccountID">Sender Account ID</MenuItem>
          <MenuItem value="receiverAccountID">Receiver Account ID</MenuItem>
          <MenuItem value="transactionType">Transaction Type</MenuItem>
        </TextField>
        <TextField
          label="Filter Value"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          variant="outlined"
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleFilter} sx={{ mr: 2 }}>Filter</Button>
        <Button variant="contained" onClick={showAllTransactions}>Show All</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='transaction history table'>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>Sender Account ID</TableCell>
              <TableCell>Receiver Account ID</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Transaction Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Transaction Date</TableCell>
              <TableCell>Visibility</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {Array.isArray(transactions) && transactions.filter(transaction => !transaction.isHidden).length > 0 ? (
              transactions.filter(transaction => !transaction.isHidden).map(transaction => (
                <Row key={transaction.transactionID} transaction={transaction} handleHideTransaction={handleHideTransaction} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>No visible transactions available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionHistory;
