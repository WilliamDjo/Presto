import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  slideIndex, 
  isLastSlide 
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    onClick={(e) => e.stopPropagation()}
  >
    <DialogTitle>
      {isLastSlide ? "Delete Presentation" : "Delete Slide"}
    </DialogTitle>
    <DialogContent>
      {isLastSlide 
        ? "This is the last slide in your presentation. Deleting it will remove the entire presentation. Do you want to proceed?"
        : `Are you sure you want to delete slide ${slideIndex}? This action cannot be undone.`
      }
    </DialogContent>
    <DialogActions>
      <Button 
        onClick={onClose}
        color="primary"
      >
        Cancel
      </Button>
      <Button 
        onClick={onConfirm}
        color="error"
        variant="contained"
      >
        {isLastSlide ? "Delete Presentation" : "Delete Slide"}
      </Button>
    </DialogActions>
  </Dialog>
);