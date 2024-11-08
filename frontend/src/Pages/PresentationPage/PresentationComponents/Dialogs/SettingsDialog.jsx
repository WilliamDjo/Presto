import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Stack,
  TextField,
  Divider,
  InputLabel,
  Input,
  Card,
  CardActionArea,
  CardMedia,
  Typography
} from '@mui/material';
import { Image } from '@mui/icons-material';

const SettingsDialog = ({ 
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
            
          <Stack spacing={1}>
            <InputLabel>Thumbnail</InputLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={onThumbnailChange}
              style={{ display: 'none' }}
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload">
              <Card sx={{ width: '100%', maxWidth: 345 }}>
                <CardActionArea>
                  {thumbnail ? (
                    <CardMedia
                      component="img"
                      sx={{ height: 194 }}
                      image={thumbnail}
                      title="Presentation thumbnail"
                    />
                  ) : (
                    <CardMedia
                      sx={{
                        height: 194,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'grey.100'
                      }}
                    >
                      <Stack alignItems="center" spacing={1}>
                        <Image color="action" sx={{ fontSize: 40 }} />
                        <Typography variant="body2" color="text.secondary">
                          Click to add thumbnail
                        </Typography>
                      </Stack>
                    </CardMedia>
                  )}
                </CardActionArea>
              </Card>
            </label>
          </Stack>
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