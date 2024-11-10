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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Check if this is the last slide
  const isLastSlide = getSlides(presentations).length === 1;

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
    // if (getSlides(presentations).length === 1) {
    //   setDeletePresentationDialogOpen(true);
    // }
    setDeleteDialogOpen(false);
  };

  return (
    <>
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
            onClick={(e) => { 
              e.stopPropagation();
              setDeleteDialogOpen(true);
            }}
          >
            <Delete />
          </IconButton>
        </Box>

        <Typography>
          {index}
        </Typography>
      </Box>

      {/* Smart Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>
          {isLastSlide ? "Delete Presentation" : "Delete Slide"}
        </DialogTitle>
        <DialogContent>
          {isLastSlide 
            ? "This is the last slide in your presentation. Deleting it will remove the entire presentation. Do you want to proceed?"
            : `Are you sure you want to delete slide ${index}? This action cannot be undone.`
          }
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteSlide}
            color="error"
            variant="contained"
          >
            {isLastSlide ? "Delete Presentation" : "Delete Slide"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  
  );
};

export default SlidesBarComponent;
