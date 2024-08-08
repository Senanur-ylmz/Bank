// ** MUI Imports
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

// ** Icons Imports
import AttachmentIcon from '@mui/icons-material/Attachment';

// ** Custom Components Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts';

// ** React Imports
import React, { useState } from 'react';

const InvoicePage = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState(null);

  const handleSend = () => {
    // Implement sending logic here
  };

  const handleCancel = () => {
    // Implement cancel logic here
  };

  const handleAttachmentChange = (event) => {
    // Handle attachment change here
    const file = event.target.files[0];
    setAttachment(file);
  };

  return (
    <ApexChartWrapper>
    <Card variant="outlined" style={{ padding: '20px', boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
    <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Sol tarafta MATERIO bilgileri */}
        <div>
        <Typography variant="h5" gutterBottom>
            MATERIO
        </Typography>
        <Typography variant="body1" gutterBottom>
            Office 149, 450 South Brand Brooklyn
        </Typography>
        <Typography variant="body1" gutterBottom>
            San Diego County, CA 91905, USA
        </Typography>
        <Typography variant="body1" gutterBottom>
            +1 (123) 456 7891, +44 (876) 543 2198
        </Typography>
        </div>
        {/* Sağ tarafta Invoice bilgileri */}
        <div>
        <Typography variant="h6" gutterBottom>
            Invoice
        </Typography>
        <Typography variant="body1" gutterBottom>
            #
            4987
        </Typography>
        <Typography variant="body1" gutterBottom>
            Date Issued:
            YYYY-MM-DD
        </Typography>
        <Typography variant="body1" gutterBottom>
            Date Due:
            YYYY-MM-DD
        </Typography>
        </div>
    </CardContent>
    </Card>
      <Grid container spacing={6} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <TextField
            fullWidth
            label="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <TextField
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextareaAutosize
            rowsMin={5}
            placeholder="Message"
            style={{ width: '100%', marginTop: '20px' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            accept="image/*,.pdf"
            style={{ display: 'none' }}
            id="attachment-upload"
            type="file"
            onChange={handleAttachmentChange}
          />
          <label htmlFor="attachment-upload" style={{ marginTop: '20px' }}>
            <Button variant="outlined" component="span" startIcon={<AttachmentIcon />}>
              Add Attachment
            </Button>
          </label>
          {attachment && <Chip label={`Attachment: ${attachment.name}`} onDelete={() => setAttachment(null)} />}
        </Grid>
        
        {/* Sağ Taraf */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" style={{ padding: '20px', boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invoice
              </Typography>
              <Typography variant="body1" gutterBottom>
                #
                4987
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date Issued:
                YYYY-MM-DD
              </Typography>
              <Typography variant="body1" gutterBottom>
                Date Due:
                YYYY-MM-DD
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Tablo */}
        <Grid item xs={12}>
          {/* Tablo İçeriği */}
        </Grid>
        
        {/* Salesperson ve Description */}
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Salesperson" />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Description" />
        </Grid>
        
        {/* Altta Not */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            label="Note"
          />
        </Grid>
        
        {/* Butonlar */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item>
              <Button variant="contained" onClick={handleSend}>Send</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleCancel}>Cancel</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default InvoicePage;
