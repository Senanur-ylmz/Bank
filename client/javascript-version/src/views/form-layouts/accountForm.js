import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const AccountForm = ({ account, onClose }) => {
  // Eğer bir hesap seçilmediyse boş bir hesap nesnesi oluştur
  const initialAccount = account || { name: '', email: '', balance: '' };
  const [formData, setFormData] = React.useState(initialAccount);

  // Form verilerini güncelleme işlevi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Formu gönderme işlevi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form verilerini gönder
    console.log(formData);
    // İşlem tamamlandıktan sonra formu kapat
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Hesap Adı"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="E-posta"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Bakiye"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">Kaydet</Button>
          <Button onClick={onClose}>İptal</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AccountForm;
