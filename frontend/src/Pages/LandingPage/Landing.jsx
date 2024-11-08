import { CssBaseline, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../Components/CustomButton';
import CentralPanel from '../../Components/CentralPanel';
import CustomButton from '../../Components/CustomButton';
import CentralPanel from '../../Components/CentralPanel';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <CentralPanel maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Presto
        </Typography>

      <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
        A lean, lightweight app that is a lot more enjoyable and interesting to use and that will revolutionise the presentations industry for decades to come!
      </Typography>



      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <CustomButton
          text="Login"
          variant='contained'
          onClick={() => navigate('/login')}
          fullWidth={false}
          sx={{ py: 1.5, px: 4 }}
        />

          <CustomButton
            text="Register"
            variant='outlined'
            onClick={() => navigate('/register')}
            fullWidth={false}
            sx={{ py: 1.5, px: 4 }}
          />
        </Box>
      </CentralPanel>
    </>
  );
};

export default LandingPage;
