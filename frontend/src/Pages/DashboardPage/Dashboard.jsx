import { useState } from 'react';
import CustomButton from "../../components/CustomButton"
import { logoutFetch } from "../../HelperFiles/helper"
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presentationName, setPresentationName] = useState('');
  const [presentations, setPresentations] = useState([]);
  const navigate = useNavigate();
  
  const handleCreatePresentation = () => {
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
      <Container maxWidth="lg">
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
              onClick={() => setIsModalOpen(true)}
            />
          </Box>
        </Box>
        <Dialog 
          open={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Create New Presentation</DialogTitle>
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
            <CustomButton text="Cancel" onClick={() => setIsModalOpen(false)}/>
            <CustomButton 
              onClick={handleCreatePresentation} 
              variant="contained"
              disabled={!presentationName.trim()}
              text="Create"
            />
          </DialogActions>
        </Dialog>
      </Container>
      <CustomButton  text="Log out" onClick={handleLogout}/>
    </>
  )
}

export default DashboardPage
