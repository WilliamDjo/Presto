import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Typography,
  Checkbox,
  Paper,
  Alert
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addVideoElement, updateVideoElement } from '../../../../State/presentationsSlice';

export default function VideoModal({ open, handleClose, initialData, isEditing = false }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState(initialData || {
    width: 0.5,
    height: 0.5,
    videoSource: '',
    altText: '',
    autoplay: false,
    muted: true,
  });
  
  const [error, setError] = useState('');

  // Set preview video source if editing
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(initialData);
    }
  }, [isEditing, initialData]);
  
  const getYouTubeVideoId = (url) => {
    try {
      // Handle different YouTube URL formats
      let videoId = null;
      
      // Handle youtu.be format
      if (url.includes('youtu.be')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      // Handle youtube.com/embed format
      else if (url.includes('/embed/')) {
        videoId = url.split('/embed/')[1]?.split('?')[0];
      }
      // Handle youtube.com/watch format
      else if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      }
      // Handle youtube.com/v format
      else if (url.includes('youtube.com/v/')) {
        videoId = url.split('youtube.com/v/')[1]?.split('?')[0];
      }
      
      return videoId;
    } catch (e) {
      return e;
    }
  };
  
  
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field === 'videoSource') {
      const videoId = getYouTubeVideoId(value);
      if (value && !videoId) {
        setError('Please enter a valid YouTube URL');
      } else {
        setError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Ensure autoplay has muted enabled (browser requirement)
  useEffect(() => {
    if (formData.autoplay && !formData.muted) {
      setFormData(prev => ({
        ...prev,
        muted: true
      }));
    }
  }, [formData.autoplay, formData.muted]);

  const convertToEmbedUrl = (id) => {
    return  `https://www.youtube.com/embed/${id}`;
  }
  
  const validateForm = () => {
    if (!formData.videoSource) {
      setError('Please provide a video URL');
      return false;
    }
    
    const videoId = getYouTubeVideoId(formData.videoSource);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return false;
    }
    
    if (!formData.altText?.trim()) {
      setError('Please provide alt text for accessibility');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Convert any YouTube URL to embed format
    const videoId = getYouTubeVideoId(formData.videoSource);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const elementData = {
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      videoSource: embedUrl,
      altText: formData.altText,
      autoplay: formData.autoplay,
      muted: formData.muted,
    };

    if (isEditing) {
      dispatch(updateVideoElement({
        index: formData.index,
        attributes: elementData
      }));
    } else {
      dispatch(addVideoElement({
        ...elementData,
        position: {
          x: 0.1,
          y: 0.1
        }
      }));
    }

    handleClose();
    if (!isEditing) {
      setFormData({
        width: 0.5,
        height: 0.5,
        videoSource: '',
        altText: '',
        autoplay: false,
        muted: true,
      });
    }
    setError('');
  };

  const previewVideoId = getYouTubeVideoId(formData.videoSource);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Video Element' : 'Add Video Element'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Supported YouTube URL formats:
            <ul style={{ marginTop: '8px', marginBottom: '0' }}>
              <li>youtube.com/watch?v=VIDEO_ID</li>
              <li>youtu.be/VIDEO_ID</li>
              <li>youtube.com/embed/VIDEO_ID</li>
            </ul>
          </Alert>
          <TextField
            fullWidth
            label="Video URL"
            value={formData.videoSource}
            onChange={handleChange('videoSource')}
            error={!!error}
            helperText={error || "Enter YouTube embed URL or direct video URL"}
            placeholder="https://www.youtube.com/embed/..."
          />

          {formData.videoSource && previewVideoId && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'grey.100',
                overflow: 'hidden'
              }}
            >
              <Typography variant="subtitle2" color="success.main" sx={{ mb: 1 }}>
                ✓ Valid YouTube URL
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Video ID: {previewVideoId}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview</Typography>
              <iframe
                src={convertToEmbedUrl(previewVideoId)}
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  border: 'none'
                }}
                allowFullScreen
              /> 
            </Paper>
          )}

          <TextField
            fullWidth
            label="Alt Text"
            value={formData.altText}
            onChange={handleChange('altText')}
            helperText="Describe the video for accessibility"
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Video Options</Typography>
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.autoplay}
                  onChange={handleChange('autoplay')}
                />
              }
              label={
                <Box>
                  <Typography>Autoplay</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Note: Autoplay requires muted to be enabled due to browser policies
                  </Typography>
                </Box>
              }
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.muted}
                  onChange={handleChange('muted')}
                />
              }
              label={
                <Box>
                  <Typography>Muted</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Start video without sound (can be unmuted by viewer)
                  </Typography>
                </Box>
              }
            />
          
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.videoSource || !formData.altText?.trim() || !!error}
        >
          {isEditing ? 'Save Changes' : 'Add Video'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
