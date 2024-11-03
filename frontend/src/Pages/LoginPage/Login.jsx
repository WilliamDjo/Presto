// Import necessary modules
import { useState } from 'react';
import { TextField, Typography, Container, Box, Paper, Avatar, IconButton, Link, Alert } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/CustomButton';
import { authFetch } from '../../HelperFiles/helper';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {  // make this async
    e.preventDefault();
    setError('');
    
    try {
      const res = await authFetch({ email, password }, '/admin/auth/login');  // await here
      
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          mb={2}
        >
          <IconButton onClick={() => navigate('/')}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlined />
            </Avatar>
          </IconButton>

          <Typography variant="h5" component="h1" fontWeight="bold">
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1, mb: 2 }}>
            Please sign in to your account
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            variant="outlined"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
          />
          <CustomButton
            text="Login"
            onClick={handleSubmit}
            color="primary"
            sx={{ mt: 2 }}
          />
        </Box>
        <CustomButton
          text="Back to Home"
          onClick={() => navigate('/')}
          variant="outlined"
          color="primary"
          sx={{ mt: 2 }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have an account? <Link onClick={() => navigate('/register')} style={{ color: '#1976d2', textDecoration: 'none' }}>Sign Up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;
