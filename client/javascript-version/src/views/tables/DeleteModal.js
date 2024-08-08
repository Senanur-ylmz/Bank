import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { updateAccountName, deleteAccount } from '../../service/Account';
import TextField from '@mui/material/TextField';

const UpdateModal = ({ open, handleClose, account, onUpdate }) => {
  const [newAccountName, setNewAccountName] = useState(account.accountName);

  const handleUpdate = async () => {
    try {
      await updateAccountName(account.accountID, newAccountName);
      onUpdate(); // Hesap bilgilerini güncellemek için parent bileşene tetikleme
      handleClose(); // Modalı kapat
    } catch (error) {
      console.error('Error updating account name:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Hesap Adını Düzenle
        </Typography>
        <TextField
          label='Yeni Hesap Adı'
          variant='outlined'
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
        />
        <Button variant='contained' onClick={handleUpdate}>
          Kaydet
        </Button>
      </Box>
    </Modal>
  );
};

const DeleteModal = ({ open, handleClose, account, onDelete }) => {
  const handleDelete = async () => {
    try {
      await deleteAccount(account.accountID);
      onDelete(); // Hesabı silmek için parent bileşene tetikleme
      handleClose(); // Modalı kapat
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant='h6' gutterBottom>
          Hesap Silme
        </Typography>
        <Typography variant='body1' gutterBottom>
          {`"${account.accountName}" adlı "${account.accountID}" id'li hesabı silmek istediğinize emin misiniz?`}
        </Typography>
        <Button variant='contained' onClick={handleDelete}>
          Sil
        </Button>
        <Button variant='outlined' onClick={handleClose} sx={{ ml: 2 }}>
          İptal
        </Button>
      </Box>
    </Modal>
  );
};

export { UpdateModal, DeleteModal };
