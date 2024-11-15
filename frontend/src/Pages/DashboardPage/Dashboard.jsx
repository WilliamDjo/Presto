import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../../Components/CustomButton";
import { logoutFetch } from "../../HelperFiles/helper";
import Grid from '@mui/material/Grid';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  Typography,
  Box,
  Container,
  Alert,
  CssBaseline,
  CardMedia,
  IconButton,
} from '@mui/material';
import { Image, AddCircle, Logout } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setPresentations, savePresentations, createNewPresentation } from '../../State/presentationsSlice';
import ThumbnailUpload from '../../Components/ThumbnailUpload';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationTitle, setPresentationTitle] = useState('');
  const [presentationDescription, setPresentationDescription] = useState('');
  const [presentationThumbnail, setPresentationThumbnail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const presentations = useSelector((state) => state.presentations.presentations);

  useEffect(() => {
    if (isModalOpen) {
      setPresentationTitle("");
      setPresentationDescription("");
      setPresentationThumbnail("");
    }
  }, [isModalOpen]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setError("File is too large. Please choose an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPresentationThumbnail(e.target.result);
      };
      reader.onerror = (e) => {
        console.error("Error reading file:", e);
        setError("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNewPresentation = (e) => {
    e.preventDefault();
    setError('');

    if (presentationTitle.trim()) {
      dispatch(createNewPresentation({ presentationTitle, presentationDescription, presentationThumbnail }));
      setIsModalOpen(false);
    } else {
      setError('Please enter a valid name');
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await logoutFetch('/admin/auth/logout', token);

      if (res.success) {
        localStorage.removeItem('token');
        dispatch(setPresentations(null));
        navigate('/');
      } else {
        console.error('Logout failed:', res.error);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  useEffect(() => {
    dispatch(savePresentations(null));
  }, [presentations, dispatch]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" tabIndex={-1}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <IconButton onClick={handleLogout} color="primary" sx={{ mr: 2 }}>
            <Logout fontSize="large" sx={{ transform: 'scaleX(-1)' }} />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Presentations
          </Typography>
          <CustomButton
            text="New Presentation"
            variant="contained"
            color="primary"
            startIcon={<AddCircle />}
            onClick={() => { setIsModalOpen(true); setError('') }}
            fullWidth={false}
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
          <Box component="form" onSubmit={handleCreateNewPresentation}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Presentation Name"
                type="text"
                fullWidth
                variant="outlined"
                value={presentationTitle}
                onChange={(e) => setPresentationTitle(e.target.value)}
                sx={{ mt: 2 }}
              />
              <TextField
                margin="dense"
                label="Presentation Description"
                type="text"
                fullWidth
                variant="filled"
                multiline
                minRows={4}
                value={presentationDescription}
                onChange={(e) => setPresentationDescription(e.target.value)}
                sx={{ mt: 2 }}
              />

              <ThumbnailUpload
                thumbnail={presentationThumbnail}
                resetThumbnail={() => setPresentationThumbnail("")}
                onThumbnailChange={handleThumbnailChange}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <CustomButton
                onClick={handleCreateNewPresentation}
                variant="contained"
                disabled={!presentationTitle.trim()}
                text="Create"
              />
            </DialogActions>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <CustomButton variant="outlined" text="Cancel" onClick={() => { setIsModalOpen(false); }} />
            </DialogActions>
          </Box>
        </Dialog>

        <Grid container spacing={3}>
          {presentations?.map((presentation) => (
            <Grid item xs={12} sm={6} md={4} key={presentation.id}>
              <Card
                sx={{
                  width: '100%',
                  minWidth: '100px',
                  aspectRatio: '2 / 1', // Set 2:1 ratio
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  },
                }}
                onClick={() => navigate(`/presentation/${presentation.id}#/1`)}
              >
                {presentation.thumbnail ? (
                  <CardMedia
                    component="img"
                    image={presentation.thumbnail}
                    alt={presentation.title}
                    sx={{
                      width: 64, // Display as an icon-sized image
                      height: 64,
                      borderRadius: '4px',
                      mr: 2
                    }}
                  />
                ) : (
                  <Image
                    sx={{
                      width: 64,
                      height: 64,
                      color: 'grey.500',
                      mr: 2,
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h6" component="h2" noWrap>
                    {presentation.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {presentation.description || 'No description available'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {presentation.slides.length} slide{presentation.slides.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default DashboardPage;
