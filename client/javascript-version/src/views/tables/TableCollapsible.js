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
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { updateAccountName, deleteAccount } from '../../service/Account';
import { getUserAccounts } from '../../service/User';
import { UpdateModal, DeleteModal }from './DeleteModal';

const Row = ({ account, onUpdate, onDelete }) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [newAccountName, setNewAccountName] = useState(account.accountName);

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component='th' scope='row'>
          {account.accountName}
        </TableCell>
        <TableCell>{account.accountType}</TableCell>
        <TableCell>{account.iban}</TableCell>
        <TableCell>{account.balance}</TableCell>
        <TableCell>{account.availableBalance}</TableCell>
        <TableCell>{account.currency}</TableCell>
        <TableCell align='right'>
          <IconButton aria-label='edit account' onClick={handleOpenEditModal}>
            <EditIcon />
          </IconButton>
          <IconButton aria-label='delete account' onClick={handleOpenDeleteModal}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <UpdateModal
        open={openEditModal}
        handleClose={handleCloseEditModal}
        account={account}
        onUpdate={onUpdate}
      />
      <DeleteModal
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        account={account}
        onDelete={onDelete}
      />
    </>
  );
};

const TableCollapsible = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchUserAccountsData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userAccounts = await getUserAccounts(userId);
        setAccounts(userAccounts.data); // Verilerin data özelliğini kullanın
        console.log(accounts.length);
      } catch (error) {
        console.error('Error fetching user accounts:', error);
      }
    };

    fetchUserAccountsData();
  }, []);

  // Hesap bilgilerini güncellemek için kullanılan fonksiyon
  const handleUpdate = async () => {
    // Yeni bir API çağrısı yaparak güncel hesap bilgilerini alın
    try {
      const userId = localStorage.getItem('userId');
      const userAccounts = await getUserAccounts(userId);
      setAccounts(userAccounts.data);
    } catch (error) {
      console.error('Error updating accounts after edit:', error);
    }
  };

  // Hesapları silmek için kullanılan fonksiyon
  const handleDelete = async () => {
    // Hesap silindiğinde yeniden hesapları getir
    try {
      const userId = localStorage.getItem('userId');
      const userAccounts = await getUserAccounts(userId);
      setAccounts(userAccounts.data);
    } catch (error) {
      console.error('Error updating accounts after delete:', error);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell>Account Name</TableCell>
            <TableCell>Account Type</TableCell>
            <TableCell>IBAN</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Available Balance</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
        {accounts && accounts.length > 0 ? (
            accounts.map(account => (
              <Row key={account.accountID} account={account} onUpdate={handleUpdate} onDelete={handleDelete} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7}>No accounts available</TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
    </TableContainer>
  );
};

export default TableCollapsible;