import { useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  FormControlLabel,
  Typography,
  Checkbox,
  Paper
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addVideoElement } from '../../../../State/presentationsSlice';

export default function VideoModal({ open, handleClose }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    width: 0.5,
    height: 0.5,
    videoSource: '',
    altText: '',
    autoplay: false,
    muted: true,
    controls: true
  });
  
  const [error, setError] = useState('');
  
  const validateYouTubeUrl = (url) => {
    // Check if it's a valid YouTube embed URL
    const youtubeEmbedPattern = /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+/;
    return youtubeEmbedPattern.test(url);
  };
  
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    
    if (field === 'videoSource') {
      if (value && !validateYouTubeUrl(value)) {
        setError('Please enter a valid YouTube embed URL (https://www.youtube.com/embed/...)');
      } else {
        setError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };
  
  const validateForm = () => {
    if (!formData.videoSource) {
      setError('Please provide a video URL');
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
  
    dispatch(addVideoElement({
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      videoSource: formData.videoSource,
      altText: formData.altText,
      autoplay: formData.autoplay,
      muted: formData.muted,
      controls: formData.controls
    }));
  
    handleClose();
    // Reset form
    setFormData({
      width: 0.5,
      height: 0.5,
      videoSource: '',
      altText: '',
      autoplay: false,
      muted: true,
      controls: true
    });
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Video Element</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            fullWidth
            label="Video URL"
            value={formData.videoSource}
            onChange={handleChange('videoSource')}
            error={!!error}
            helperText={error || "Enter YouTube embed URL or direct video URL"}
            placeholder="https://www.youtube.com/embed/..."
          />

          {formData.videoSource && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                bgcolor: 'grey.100',
                overflow: 'hidden'
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Preview</Typography>
              <iframe
                src={formData.videoSource}
                style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  border: 'none'
                }}
                allowFullScreen
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
            helperText="Describe the video for accessibility"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.autoplay}
                  onChange={handleChange('autoplay')}
                />
              }
              label="Autoplay"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.muted}
                  onChange={handleChange('muted')}
                />
              }
              label="Muted"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.controls}
                  onChange={handleChange('controls')}
                />
              }
              label="Show Controls"
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.videoSource || !formData.altText.trim()}
        >
          Add Video
        </Button>
      </DialogActions>
    </Dialog>
  )
}
