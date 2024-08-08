// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'

const InterestRateCard = ({ interestRate }) => {
  return (
<Card sx={{ border: 0, boxShadow: 0, color: 'common.white', backgroundColor: 'info.main' }}>
  <CardContent sx={{ padding: theme => `${theme.spacing(3.25, 5, 4.5)} !important` }}>
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Avatar alt='%' src='/images/interest-rate-icon.png' sx={{ width: 80, height: 80, marginRight: 2.75 }} />
      <Box>
        <Typography variant='body1' sx={{ color: 'common.white', textAlign: 'center', fontWeight: 'bold' }}>
          Interest Rate
        </Typography>
        <Typography variant='body1' sx={{ color: 'common.white', textAlign: 'center', fontSize: 40 }}>
          2.47
        </Typography>
      </Box>
    </Box>
  </CardContent>
</Card>

  )
}

export default InterestRateCard
