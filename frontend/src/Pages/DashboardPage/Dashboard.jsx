import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../../Components/CustomButton";
import { logoutFetch } from "../../HelperFiles/helper";
import Grid from '@mui/material/Grid2';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
    Typography,
    Box,
    Container,
    Alert
} from '@mui/material';

const DashboardPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [presentationName, setPresentationName] = useState('');
    const [presentations, setPresentations] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const defaultRef = useRef();

    const handleCreatePresentation = (e) => {
        e.preventDefault();
        setError('');

        if (presentationName.trim()) {
            const newPresentation = {
                id: Date.now(),
                name: presentationName,
                slides: [
                    {
                        id: 1,
                        content: [] // Empty slide content
                    }
                ]
            };

            setPresentations([...presentations, newPresentation]);
            setPresentationName('');
            setIsModalOpen(false);
            defaultRef.current.focus();
        } else {
            setError('Please enter valid a name');
        }
    };

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await logoutFetch('/admin/auth/logout', token);

            if (res.success) {
                localStorage.removeItem('token');
                navigate('/');
            } else {
                console.error('Logout failed:', res.error);
            }
        } catch (err) {
            console.error('Error during logout:', err);
        }
    };

    return (
        <>
            <Container maxWidth="lg" ref={defaultRef} tabIndex={-1}>
                <Box sx={{ py: 4 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 4
                        }}
                    >
                        <Typography variant="h4" component="h1">
                            Presentations
                        </Typography>
                        <CustomButton
                            text="New Presentation"
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleIcon />}
                            onClick={() => { setIsModalOpen(true); setError('') }}
                        />
                    </Box>

                    <Dialog
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        maxWidth="sm"
                        fullWidth
                        aria-hidden={!isModalOpen}
                    >
                        <DialogTitle>Create New Presentation</DialogTitle>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Box component="form" onSubmit={handleCreatePresentation}>
                            <DialogContent>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Presentation Name"
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                    value={presentationName}
                                    onChange={(e) => setPresentationName(e.target.value)}
                                    sx={{ mt: 2 }}
                                />
                            </DialogContent>
                            <DialogActions sx={{ px: 3, pb: 3 }}>
                                <CustomButton
                                    onClick={handleCreatePresentation}
                                    variant="contained"
                                    disabled={!presentationName.trim()}
                                    text="Create"
                                />
                            </DialogActions>
                        </Box>
                        <DialogActions sx={{ px: 3, pb: 3 }}>
                            <CustomButton variant="outlined" text="Cancel" onClick={() => { setIsModalOpen(false); }} />
                        </DialogActions>
                    </Dialog>
                    <Grid container spacing={3}>
                        {presentations.map((presentation) => (
                            <Grid xs={12} sm={6} md={4} key={presentation.id} sx={{ cursor: 'pointer' }}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 3
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="h2" gutterBottom>
                                            {presentation.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {presentation.slides.length} slide{presentation.slides.length !== 1 ? 's' : ''}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <CustomButton text="Log out" onClick={handleLogout} />
            </Container>

        </>
    )
}

export default DashboardPage
