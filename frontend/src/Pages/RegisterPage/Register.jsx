import { CssBaseline, Box, TextField, Typography, Alert } from '@mui/material';
import CustomLink from '../../Components/CustomLink'
import CustomButton from '../../Components/CustomButton';
import CentralPanel from '../../Components/CentralPanel';
import BackButton from '../../Components/BackButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, fetchRequest } from '../../HelperFiles/helper';


const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch({ email, name, password, confirmPassword }, '/admin/auth/register');

      if (res.success) {
        localStorage.setItem('token', res.data.token);

        const newUserStore = {
          store: {
            presentations: []
          }
        };

        await fetchRequest('/store', 'put', newUserStore, res.data.token, null);

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
      <CentralPanel
        maxWidth="xs"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <BackButton color="" onClick={() => navigate('/')} />

        <Box display="flex" flexDirection="column" gap={2} component="form" onSubmit={handleRegisterClick}>
          <Typography variant="h5" align="center">
            Sign Up
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <CustomButton
            text="Register"
            onClick={handleRegisterClick}
            sx={{ mt: 2 }}
          />

        </Box>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?
          <CustomLink text="Sign in" navigateTo="/login" />
        </Typography>
      </CentralPanel>
    </>
  );
}

export default SignUpPage;
