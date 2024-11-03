import { CssBaseline, ThemeProvider, Box, Paper, Button, TextField, Typography, Link, Alert } from '@mui/material';
import theme from '../../Themes/themes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import fetchRequest from '../../HelperFiles/helper';
import { authFetch } from '../../HelperFiles/helper';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUpClick = async () => {  // make this async
    try {
      const res = await authFetch({ email, name, password }, '/admin/auth/register');  // await here
      
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
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <Paper component="section" sx={{ p: 3, width: 300 }}>

            <Box display="flex" flexDirection="column" gap={2}>
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

              <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={() => {
                handleSignUpClick();
              }}>
                                Sign Up
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Already have an account?
                <Link onClick={() => navigate('/login')} underline="hover" hover='pointer' color="primary" ml={1}>
                                    Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Box >
      </ThemeProvider >
    </>
  );
}

export default SignUpPage;
