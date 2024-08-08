import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SendIcon from '@mui/icons-material/Send';
import MenuItem from '@mui/material/MenuItem';
import { getUserAccounts, getAccountByIBAN } from '../../../service/User';
import { getTotalInvoiceNumber, createInvoice } from '../../../service/Invoices';
import InputLabel from '@mui/material/InputLabel';
import Swal from 'sweetalert2';

const IndividualInvoice = () => {
    const [senderAccount, setSenderAccount] = useState('');
    const [receiverIBAN, setReceiverIBAN] = useState('');
    const [receiverAccountID, setReceiverAccountID] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [abbreviatedName, setAbbreviatedName] = useState('');
    const [amount, setAmount] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [description, setDescription] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [receiverHint, setReceiverHint] = useState('');
    const [invoiceId, setInvoiceId] = useState('');

    useEffect(() => {
        const fetchUserAccounts = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const userAccounts = await getUserAccounts(userId);
                const filteredAccounts = userAccounts.data.filter(account => account.accountType === 'Deposit' || account.accountType === 'Checking');
                setAccounts(filteredAccounts);
            } catch (error) {
                console.error('Error fetching user accounts:', error);
            }
        };

        fetchUserAccounts();

        const fetchTotalInvoiceNumber = async () => {
            try {
                const totalInvoiceNumber = await getTotalInvoiceNumber();
                setInvoiceId(`#${totalInvoiceNumber.totalInvoiceNumber}`);
            } catch (error) {
                console.error('Error fetching total invoice number:', error);
            }
        };

        fetchTotalInvoiceNumber();
    }, []);

    const handleReceiverIBANChange = async (value) => {
        setReceiverIBAN(value);

        if (value.length === 26) {
            const response = await getAccountByIBAN(value);
            if (response && response.message === 'success') {
                const { name, surname, receiverAccountID } = response.data;
                const abbreviatedName = name.substring(0, 2) + '***';
                const abbreviatedSurname = surname.substring(0, 2) + '***';
                setReceiverAccountID(receiverAccountID);
                setAbbreviatedName(`${abbreviatedName} ${abbreviatedSurname}`);
                setReceiverHint('');
            } else {
                setReceiverHint('IBAN not found!');
                setAbbreviatedName('');
            }
        } else {
            setReceiverHint('IBAN is invalid!');
            setAbbreviatedName('');
        }
    };

    const handleSendInvoice = async () => {
        try {
            // Gönderen hesabın bakiyesini kontrol et
            if (senderAccount.balance < amount) {
                throw new Error('Insufficient balance for the sender account!');
            }
    
            // Alıcının IBAN'ını kontrol et
            if (senderAccount.iban === receiverIBAN) {
                throw new Error('Sender and recipient cannot have the same IBAN!');
            }

            // Önce invoice date ve due date'nin geçerli olup olmadığını kontrol edelim
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            const invoiceDateObj = new Date(invoiceDate);
            invoiceDateObj.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            const dueDateObj = new Date(dueDate);
            dueDateObj.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            console.log(dueDateObj, currentDate);
            if (dueDateObj < currentDate) {
                throw new Error('Due date cannot be in the past!');
            }

            if (dueDateObj < invoiceDateObj) {
                throw new Error('Due date must be after the invoice date!');
            }
    
            // Gönderen hesabın bakiyesini kontrol et
            if (senderAccount.balance < amount) {
                throw new Error('Insufficient balance for the sender account!');
            }
    
            // Alıcının IBAN'ını kontrol et
            if (senderAccount.iban === receiverIBAN) {
                throw new Error('Sender and recipient cannot have the same IBAN!');
            }
    
    
            const response = await getAccountByIBAN(receiverIBAN);
    
            if (response && response.message === 'success') {
                const { name, surname, receiverAccountID } = response.data;
    
                // Kullanıcının girdiği isim ile API'den gelen isim ve soyisim bilgilerini karşılaştır
                if (receiverName !== `${name} ${surname}`) {
                    // Kullanıcının girdiği isim ile doğrulama başarısız olduğunda hata mesajı göster
                    throw new Error('Invalid receiver name!');
                }
    
                const invoiceData = {
                    userID: localStorage.getItem('userId'),
                    senderAccountID: senderAccount.accountID,
                    receiverAccountID: receiverIBAN,
                    receiverName: receiverName,
                    transactionType: "Individual Invoice",
                    description: description,
                    amount: amount,
                    invoiceDate: invoiceDate,
                    dueDate: dueDate
                };
    
                await createInvoice(invoiceData);
    
                // Fatura gönderimi başarılı olduğunda success swal göster
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Invoice sent successfully!'
                }).then((result) => {
                    // Eğer kullanıcı "Tamam" düğmesine bastıysa, sayfayı yenile
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            } else {
                setReceiverHint('IBAN not found!');
                setAbbreviatedName('');
            }
        } catch (error) {
            console.error('Error sending individual invoice:', error);
            // Hata mesajını SweetAlert ile göster
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message
            });
        }
    };
    
    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Invoice {invoiceId}</Typography>
                <Typography variant="body1" gutterBottom>Invoice Date: {invoiceDate}</Typography>
                <Typography variant="body1" gutterBottom>Due Date: {dueDate}</Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Individual Invoice</Typography>
                    <Card variant="outlined">
                        <CardContent>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        label="Sender Account"
                                        value={senderAccount}
                                        onChange={(e) => setSenderAccount(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {accounts.map((account) => (
                                            <MenuItem key={account.accountID} value={account}>
                                                {account.accountName}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Receiver IBAN"
                                        value={receiverIBAN}
                                        onChange={(e) => handleReceiverIBANChange(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        error={receiverHint !== ''}
                                        helperText={receiverHint}
                                        inputProps={{ maxLength: 26 }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Receiver Name"
                                        value={receiverName}
                                        onChange={(e) => setReceiverName(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            endAdornment: abbreviatedName && (
                                                <Typography variant="body2" color="textSecondary">{abbreviatedName}</Typography>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        type="number"
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={3} sx={{ mb: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <InputLabel htmlFor="invoice-date">Invoice Date</InputLabel>
                                    <TextField
                                        id="invoice-date"
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <InputLabel htmlFor="due-date">Due Date</InputLabel>
                                    <TextField
                                        id="due-date"
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                        helperText="Due date must be after the invoice date."
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                variant="contained"
                                onClick={handleSendInvoice}
                                disabled={!senderAccount || !receiverIBAN || !receiverName || !amount || !invoiceDate || !dueDate}
                                endIcon={<SendIcon />}
                            >
                                Send Invoice
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Paper>
        </Box>
    );
};

export default IndividualInvoice;
