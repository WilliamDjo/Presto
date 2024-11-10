import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Settings, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { deleteSlide } from '../../../../State/presentationsSlice';
import { getSlides } from '../../../../HelperFiles/helper';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const SlidesBarComponent = ({ index, sx = { 
  height: "60%", 
  minWidth: "8%", 
  backgroundColor: "white", 
  display: "flex", 
  justifyContent: "center", 
  alignItems: "center", 
  borderRadius: "10px", 
  cursor: "pointer", 
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  '&:hover': {
    backgroundColor: "#f0f0f0",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
  },
  border: index == location.hash.split("/")[1] ? "2px solid black" : ""
}}) => {
  const presentations = useSelector(state => state.presentations.presentations);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  // State for managing dialog visibility
  const [deleteSlideDialogOpen, setDeleteSlideDialogOpen] = useState(false);
  const [deletePresentationDialogOpen, setDeletePresentationDialogOpen] = useState(false);

  // Function to handle box click and navigate
  const handleBoxClick = () => {
    navigate(`${location.pathname}#/${index}`);
  };

  // Function to handle slide deletion
  const handleDeleteSlide = () => {
    dispatch(deleteSlide(index));
    if (index <= parseInt(location.hash.split("/")[1]) && parseInt(location.hash.split("/")[1]) !== 1) {
      navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
    }
    if (getSlides(presentations).length === 1) {
      setDeletePresentationDialogOpen(true);
    }
    setDeleteSlideDialogOpen(false);
  };

  return (
    <Box 
      onClick={handleBoxClick} 
      sx={{ 
        ...sx, 
        position: "relative", 
        '&:hover .icon-buttons': { // Show buttons on hover
          opacity: 1 
        }
      }}
    >
      <Box 
        className="icon-buttons" 
        sx={{ 
          position: "absolute", 
          top: 0, 
          right: 0, 
          display: "flex", 
          justifyContent: "space-between", 
          width: "100%", 
          opacity: 0, // Initially hidden
          transition: "opacity 0.3s ease" // Smooth transition
        }}
      >
        {/* Prevent propagation for button clicks */}
        <IconButton size="small" sx={{ color: theme.palette.primary.main }} onClick={(e) => e.stopPropagation()}>
          <Settings />
        </IconButton>
        <IconButton 
          size="small" 
          sx={{ color: "red" }} 
          onClick={(e) => 
          { 
            e.stopPropagation();
            setDeleteSlideDialogOpen(true);
            // dispatch(deleteSlide(index));
            // if (index <= parseInt(location.hash.split("/")[1]) && parseInt(location.hash.split("/")[1]) !== 1) {
            //   navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`);
            // }
            // if (getSlides(presentations).length === 1) {
            //   console.log('Prompt user to delete presentation');
            //   // TODO: Add modal to prompt user if they want to delete the presentation
            // }
            // // TODO: Add modal to confirm if the user really wants to delete the slide
          }
          }
        >
          <Delete />
        </IconButton>
      </Box>
      {/* Delete Slide Confirmation Dialog */}
      <Dialog
        open={deleteSlideDialogOpen}
        onClose={() => setDeleteSlideDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Delete Slide</DialogTitle>
        <DialogContent>
          Are you sure you want to delete slide {index}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteSlideDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSlide}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Typography>
        {index}
      </Typography>
    </Box>
  );
};

export default SlidesBarComponent;
