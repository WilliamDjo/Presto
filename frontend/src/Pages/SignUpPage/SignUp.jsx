import { CssBaseline, ThemeProvider, Box, Paper, Button, TextField, Typography, Link } from '@mui/material';
import theme from '../../Themes/themes';
import fetchRequest from '../../HelperFiles/helper';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        const res = fetchRequest('/admin/auth/register', 'post', { email, password, name }, null, null)
        console.log(res);
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
                                console.log(fetchRequest('/admin/auth/register', 'post', { email, password, name }, null, null));
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
