import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
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
      </Paper>
    </Container>
  );
};

export default LandingPage;
