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
  const [titleFontSize, setTitleFontSize] = useState('2rem');
  
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

  const width = window.innerWidth;
  useEffect(() => {
    const handleResize = () => {
      if (width > 1200) {
        setTitleFontSize('2.5rem');
      } else if (width > 800) {
        setTitleFontSize('2rem');
      } else {
        setTitleFontSize('1.5rem');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call to set font sizes

    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" tabIndex={-1}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2 }}>
          <IconButton title="Logout" onClick={handleLogout} color="primary" sx={{ mr: 2 }}>
            <Logout fontSize="large" sx={{ transform: 'scaleX(-1)' }} />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1, fontSize: titleFontSize }}>
            Presentations
          </Typography>
          <IconButton title="Create New Presentation" variant="contained" color="primary" onClick={() => { setIsModalOpen(true); setError('') }}>
            <AddCircle fontSize="large"/>
          </IconButton>
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
