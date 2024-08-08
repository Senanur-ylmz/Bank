import { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { styled, useTheme } from '@mui/material/styles';
import { getUserAccounts, getNameSurname } from '../../service/User'; // Kullanıcı hesaplarını getiren servis

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute'
});

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
});

const Trophy = ({ userID }) => {
  const theme = useTheme();
  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png';

  // State to hold the total balance
  const [totalBalance, setTotalBalance] = useState(0);
  const [namesurname, setNamesurname] = useState(0);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        // Fetch user accounts
        const userID = localStorage.getItem('userId');
        const accounts = await getUserAccounts(userID);
        console.log('User accounts:', accounts.data);
        const namesurname = await getNameSurname(userID);
        setNamesurname(namesurname);
        console.log(namesurname.name);
        // Check if accounts is an array
        if (Array.isArray(accounts.data)) {
          // Calculate total balance
          const balance = accounts.data.reduce((acc, curr) => acc + curr.balance, 0);
          // Set total balance
          setTotalBalance(balance);
        } else {
          console.error('Error: Accounts is not an array');
        }
      } catch (error) {
        console.error('Error fetching user accounts:', error);
      }
    };
  
    // Call the function to fetch user accounts when the component mounts
    fetchUserAccounts();
  }, [userID]); // Ensure that userID is properly structured
  
  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>Congratulations  {namesurname.name} 🥳</Typography>
        <Typography variant='h6'>Your Total Balance</Typography>
        <Typography variant='h4' sx={{ letterSpacing: '0.25px', fontWeight: 'bold', mt: 2 }}>
          {`$${totalBalance.toFixed(2)}`}
        </Typography>
        <Button href='pages/account' size='small' variant='contained' sx={{ mt: 2 }}>
          View Accounts
        </Button>
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  );
};

export default Trophy;
