// src/components/SettingsDialog.jsx
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Stack,
  TextField,
  Divider,
  Alert
} from '@mui/material';
import ThumbnailUpload from '../../../../Components/ThumbnailUpload';

const SettingsDialog = ({ 
  error,
  open, 
  onClose, 
  onSave, 
  title,
  thumbnail,
  onTitleChange,
  onThumbnailChange 
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Presentation Settings</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            autoFocus
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            variant="outlined"
          />
          
          <Divider />
          
          <ThumbnailUpload 
            thumbnail={thumbnail}
            onThumbnailChange={onThumbnailChange}
          />

          <Divider />

          <Alert>Background</Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;