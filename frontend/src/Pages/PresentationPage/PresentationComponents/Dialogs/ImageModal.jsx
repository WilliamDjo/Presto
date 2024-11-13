import { useState, useCallback, useEffect } from 'react';
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
  // Tab,
  // Tabs,
  Paper
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { CloudUpload } from '@mui/icons-material';
import { addImageElement, updateImageElement } from '../../../../State/presentationsSlice';

export default function ImageModal({ open, handleClose, initialData, isEditing = false }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState(initialData || {
    width: 0.5,
    height: 0.5,
    imageSource: '',
    altText: '',
  });
  
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  // Set initial preview if editing
  useEffect(() => {
    if (isEditing && initialData?.imageSource) {
      setPreviewUrl(initialData.imageSource);
    }
  }, [isEditing, initialData]);
  
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  
    if (field === 'imageSource') {
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
  
  // const handleTabChange = (event, newValue) => {
  //   setFormData({
  //     ...formData,
  //     uploadMethod: newValue,
  //     imageSource: ''
  //   });
  //   setPreviewUrl('');
  //   setError('');
  // };
  
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

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      console.log('From ImageModal.jsx -> validateUrl()', e);
      return false;
    }
  };

  const validateForm = () => {
    if (!formData.imageSource) {
      setError('Please provide an image source');
      return false;
    }

    if (!validateUrl(formData.imageSource)) {
      setError('Please enter a valid URL');
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
  
    const elementData = {
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      imageSource: formData.imageSource,
      altText: formData.altText
    };

    if (isEditing) {
      dispatch(updateImageElement({
        index: formData.index,
        attributes: elementData
      }));
    } else {
      dispatch(addImageElement({
        ...elementData,
        position: {
          x: 0.1,
          y: 0.1
        }
      }));
    }
  
    handleClose();
    // Only reset if not editing
    if (!isEditing) {
      setFormData({
        width: 0.5,
        height: 0.5,
        imageSource: '',
        altText: ''
      });
    }
    setPreviewUrl('');
    setError('');
  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Image Element' : 'Add Image Element'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageSource}
              onChange={handleChange('imageSource')}
              error={!!error}
              helperText={error || "Enter the URL of the image"}
              placeholder="https://example.com/image.jpg"
            />

            <Typography align="center" sx={{ my: 1 }}>OR</Typography>

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
                >
                Upload Image File
                </Button>
              </label>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              Maximum file size: 5MB
              </Typography>
            </Box>
          </Box>

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
                onError={() => setError('Unable to load image')}
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
          disabled={!formData.imageSource || !formData.altText.trim() || !!error}
        >
          {isEditing ? 'Save Changes' : 'Add Image'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
