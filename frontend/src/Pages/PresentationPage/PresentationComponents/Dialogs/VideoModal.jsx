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
      console.log('videoId', videoId);
      
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
  
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };

  const convertToEmbedUrl = (id) => {
    return  `https://www.youtube.com/embed/${id}`;
  }
  
  const handleSubmit = () => {
    if (!formData.videoSource) {
      setError('Please provide a video URL');
      return;
    }
    
    const videoId = getYouTubeVideoId(formData.videoSource);
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }
    
    if (!formData.altText.trim()) {
      setError('Please provide alt text for accessibility');
      return;
    }
  
    // Convert any YouTube URL to embed format
    const embedUrl = convertToEmbedUrl(videoId);
    console.log('embedUrl', embedUrl);
    
    dispatch(addVideoElement({
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      videoSource: embedUrl,
      altText: formData.altText,
      autoplay: formData.autoplay,
      muted: formData.muted,
      controls: formData.controls
    }));
  
    handleClose();
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

  const previewVideoId = getYouTubeVideoId(formData.videoSource);

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
