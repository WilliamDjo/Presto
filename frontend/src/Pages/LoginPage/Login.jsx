// Import necessary modules
import { useState } from 'react';
import { TextField, Typography, Box, Avatar, IconButton, Alert, CssBaseline } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '../../HelperFiles/helper';
import CustomButton from '../../Components/CustomButton';
import CustomLink from '../../Components/CustomLink'
import CentralPanel from '../../Components/CentralPanel';
import BackButton from '../../Components/BackButton';
import { useDispatch } from 'react-redux';
import { fetchPresentations } from '../../State/presentationsSlice';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle form submission
  const handleLoginClick = async (e) => {  // make this async
    e.preventDefault();
    setError('');

    try {
      const res = await authFetch({ email, password }, '/admin/auth/login');  // await here

      if (res.success) {
        localStorage.setItem('token', res.data.token);
        dispatch(fetchPresentations());
        navigate('/dashboard');
      } else {
        setError(res.error);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <CssBaseline />
      <CentralPanel>
        <BackButton color="" onClick={() => navigate('/')} />

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

        <Box component="form" onSubmit={handleLoginClick}>
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
            onClick={handleLoginClick}
            sx={{ mt: 2 }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don&apos;t have an account? <CustomLink text="Register" navigateTo="/register" />
        </Typography>
      </CentralPanel>
    </>
  );
};

export default Login;
