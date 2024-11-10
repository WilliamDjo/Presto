import { useState, useCallback } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  Typography,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
// import { useDispatch } from 'react-redux';
import { CloudUpload } from '@mui/icons-material';

export default function ImageModal({ open, handleClose }) {
//   const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    width: 0.5,
    height: 0.5,
    imageSource: '',
    altText: '',
    uploadMethod: 'url' // 'url' or 'file'
  });
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  
    if (field === 'imageSource' && formData.uploadMethod === 'url') {
      setPreviewUrl(event.target.value);
      setError('');
    }
  };
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };
  
  const handleTabChange = (event, newValue) => {
    setFormData({
      ...formData,
      uploadMethod: newValue,
      imageSource: ''
    });
    setPreviewUrl('');
    setError('');
  };
  
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should be less than 5MB');
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageSource: reader.result
        }));
        setPreviewUrl(reader.result);
        setError('');
      };
      reader.onerror = () => {
        setError('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  const validateForm = () => {
    if (!formData.imageSource) {
      setError('Please provide an image source');
      return false;
    }
    if (!formData.altText.trim()) {
      setError('Please provide alt text for accessibility');
      return false;
    }
    return true;
  };
  
  const handleSubmit = () => {
    if (!validateForm()) return;
  
    // dispatch(addImageElement({
    //   elementSize: {
    //     x: formData.width,
    //     y: formData.height
    //   },
    //   imageSource: formData.imageSource,
    //   altText: formData.altText
    // }));
  
    console.log('Image uploaded');
    

    handleClose();
    // // Reset form
    // setFormData({
    //   width: 0.5,
    //   height: 0.5,
    //   imageSource: '',
    //   altText: '',
    //   uploadMethod: 'url'
    // });
    setPreviewUrl('');
    setError('');
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Image Element</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Tabs
            value={formData.uploadMethod}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Image URL" value="url" />
            <Tab label="Upload File" value="file" />
          </Tabs>

          {formData.uploadMethod === 'url' ? (
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageSource}
              onChange={handleChange('imageSource')}
              error={!!error}
              helperText={error}
            />
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <input
                accept="image/*"
                type="file"
                id="image-upload"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mb: 2 }}
                >
                  Choose Image File
                </Button>
              </label>
              {error && (
                <Typography color="error" sx={{ mt: 1 }}>
                  {error}
                </Typography>
              )}
            </Box>
          )}

          {previewUrl && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'grey.100'
              }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain'
                }}
              />
            </Paper>
          )}

          <Box>
            <Box sx={{ mb: 1 }}>Width (relative to slide)</Box>
            <Slider
              value={formData.width}
              onChange={handleSliderChange('width')}
              min={0.1}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          
          <Box>
            <Box sx={{ mb: 1 }}>Height (relative to slide)</Box>
            <Slider
              value={formData.height}
              onChange={handleSliderChange('height')}
              min={0.1}
              max={1}
              step={0.1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <TextField
            fullWidth
            label="Alt Text"
            value={formData.altText}
            onChange={handleChange('altText')}
            helperText="Describe the image for accessibility"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.imageSource || !formData.altText.trim()}
        >
          Add Image
        </Button>
      </DialogActions>
    </Dialog>
  );
}
