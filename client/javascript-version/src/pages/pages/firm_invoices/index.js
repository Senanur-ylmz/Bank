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
import { getAllFirms, getFilteredFirms } from '../../../service/Firms';
import { getUserAccounts } from '../../../service/User';
import Swal from 'sweetalert2';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoneyIcon from '@mui/icons-material/Money';
import CardLinkedIn from 'src/views/cards/CardLinkedIn'
import InputLabel from '@mui/material/InputLabel';
import { getTotalInvoiceNumber, createInvoice } from '../../../service/Invoices';

const FirmInvoice = () => {
    const [senderAccount, setSenderAccount] = useState('');
    const [receiverCompany, setReceiverCompany] = useState('');
    const [subscriptionId, setSubscriptionId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [debts, setDebts] = useState([]);
    const [invoiceDate, setInvoiceDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);

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

        const fetchCompanies = async () => {
            try {
                const companiesResponse = await getAllFirms();
                setCompanies(companiesResponse);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchUserAccounts();
        fetchCompanies();
    }, []);

    const handleCheckDebts = async () => {
        try {
            const filterData = {
                id: receiverCompany.id,
                subscription_id: subscriptionId
            };
    
            const response = await getFilteredFirms(filterData);
    
            if (response && response.length > 0) {
                setDebts(response);
            } else {
                setDebts([]);
                Swal.fire({
                    icon: 'info',
                    title: 'No Debts',
                    text: 'No debts found for the selected company and subscription ID.'
                });
            }
        } catch (error) {
            console.error('Error checking debts:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message
            });
        }
    };

    const handleSendInvoice = async () => {
        try {
            const amount = debts[0].payment_value + (debts[0].payment_value * debts[0].interest_rate_overdue_payment / 100);
    
            // Gönderen hesabın bakiyesini kontrol et
            if (senderAccount.balance < amount) {
                throw new Error('Insufficient balance for the sender account!');
            }
    
            // Önce invoice date ve due date'nin geçerli olup olmadığını kontrol edelim
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            const invoiceDateObj = new Date(invoiceDate);
            invoiceDateObj.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            const dueDateObj = new Date(dueDate);
            dueDateObj.setHours(0, 0, 0, 0); // Saat, dakika, saniye ve milisaniye değerlerini sıfırla
            
            if (dueDateObj < currentDate) {
                throw new Error('Due date cannot be in the past!');
            }
    
            if (dueDateObj < invoiceDateObj) {
                throw new Error('Due date must be after the invoice date!');
            }
    
    
                console.log(senderAccount.accountID,debts[0].company_name,amount,invoiceDate,dueDate);
    
                const invoiceData = {
                    userID: localStorage.getItem('userId'),
                    senderAccountID: senderAccount.accountID,
                    receiverAccountID: debts[0].company_name, // Değişiklik
                    receiverName: debts[0].company_name,
                    transactionType: "Firm Invoice", // Değişiklik
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
    
        } catch (error) {
            console.error('Error sending firm invoice:', error);
    
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
                <Typography variant="h4" gutterBottom>Firm Invoice</Typography>
                <Box sx={{ mt: 3 }}>
                    <Typography variant="h5" gutterBottom>Firm Invoice Details</Typography>
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
                                        select
                                        label="Receiver Company"
                                        value={receiverCompany}
                                        onChange={(e) => setReceiverCompany(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                    >
                                        {companies.map((company) => (
                                            <MenuItem key={company.id} value={company}>
                                                {company.company_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Subscription ID"
                                        value={subscriptionId}
                                        onChange={(e) => setSubscriptionId(e.target.value)}
                                        fullWidth
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                variant="contained"
                                onClick={handleCheckDebts}
                                disabled={!senderAccount || !receiverCompany || !subscriptionId}
                            >
                                Check Debts
                            </Button>
                        </CardContent>
                    </Card>
                </Box>

                {debts.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h5" gutterBottom>Debts</Typography>
                        {debts.map((debt, index) => (
                            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                                <CardContent>
                                    <Typography variant="subtitle1" gutterBottom>Firma İsmi: {debt.company_name}</Typography>
                                    {debt.payment_status === 'Paid' ? (
                                        <Typography variant="body1" gutterBottom>Borcunuz Yok!</Typography>
                                    ) : (
                                        <>
                                            <CardLinkedIn paymentValue={debt.payment_value} interestRate={debt.interest_rate_overdue_payment} />
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
                                        </>
                                        
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={handleSendInvoice}
                        disabled={!senderAccount || !receiverCompany || !subscriptionId || debts.length === 0 || debts.some(debt => debt.payment_status === 'Paid')}
                        endIcon={<SendIcon />}
                    >
                        Send Invoice
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default FirmInvoice;
