import { CssBaseline, ThemeProvider, Box, Paper, Button, TextField, Typography, Link } from '@mui/material';
import theme from '../../Themes/themes';

const SignUp = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh" // Full viewport height
                >
                    <Paper component="section" sx={{ p: 3, width: 300 }}>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Typography variant="h5" align="center">
                                Sign Up
                            </Typography>

                            <TextField label="Full Name" fullWidth />
                            <TextField label="Email" fullWidth />
                            <TextField label="Password" type="password" fullWidth />
                            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
                                Sign Up
                            </Button>

                            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                                Already have an account?{' '}
                                <Link href="/signin" underline="hover" color="primary">
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default SignUp;
