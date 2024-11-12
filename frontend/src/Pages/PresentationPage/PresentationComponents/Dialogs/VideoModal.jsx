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
  Switch,
  FormControlLabel,
  Typography,
  Alert
} from '@mui/material';

// const addVideoElement = (videoData) => ({
//     type: 'presentations/addVideoElement',
//     payload: videoData
//   });
  

export default function VideoModal({ open, handleClose }) {
//   const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    width: 0.5,
    height: 0.5,
    videoUrl: '',
    autoplay: false
  });
  
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  
  const validateYoutubeUrl = (url) => {
    // Check if it's already in embed format
    const embedPattern = /^https?:\/\/(?:www\.)?youtube\.com\/embed\/[\w-]+/;
    if (embedPattern.test(url)) {
      return url;
    }
  
    // Convert regular YouTube URL to embed URL
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([\w-]+)/
    ];
  
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
  
    return null;
  };
  
  const handleChange = (field) => (event) => {
    const value = field === 'autoplay' ? event.target.checked : event.target.value;
    setFormData({
      ...formData,
      [field]: value
    });
  
    if (field === 'videoUrl') {
      setError('');
      const embedUrl = validateYoutubeUrl(value);
      if (embedUrl) {
        setPreview(embedUrl);
        setFormData(prev => ({
          ...prev,
          videoUrl: embedUrl
        }));
      } else if (value) {
        setError('Please enter a valid YouTube URL');
        setPreview(null);
      }
    }
  };
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };
  
  const handleSubmit = () => {
    if (!formData.videoUrl) {
      setError('Please provide a video URL');
      return;
    }
  
    const embedUrl = validateYoutubeUrl(formData.videoUrl);
    if (!embedUrl) {
      setError('Please enter a valid YouTube URL');
      return;
    }
  
    // // Add autoplay parameter to URL if enabled
    // const finalUrl = formData.autoplay 
    //   ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`
    //   : embedUrl;
  
    // dispatch(addVideoElement({
    //   elementSize: {
    //     x: formData.width,
    //     y: formData.height
    //   },
    //   videoUrl: finalUrl,
    //   autoplay: formData.autoplay
    // }));
    console.log('Video uploaded');
    
  
    handleClose();
    // // Reset form
    // setFormData({
    //   width: 0.5,
    //   height: 0.5,
    //   videoUrl: '',
    //   autoplay: false
    // });
    setPreview(null);
    setError('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Video Element</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            fullWidth
            label="YouTube Video URL"
            value={formData.videoUrl}
            onChange={handleChange('videoUrl')}
            error={!!error}
            helperText={error || "Enter either a standard YouTube URL or embed URL"}
          />

          <Alert severity="info" sx={{ mt: 1 }}>
            Supported formats:
            <Box component="ul" sx={{ mt: 1, mb: 0 }}>
              <li>Standard: https://www.youtube.com/watch?v=dQw4w9WgXcQ</li>
              <li>Short: https://youtu.be/dQw4w9WgXcQ</li>
              <li>Embed: https://www.youtube.com/embed/dQw4w9WgXcQ</li>
            </Box>
          </Alert>

          {preview && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Box 
                sx={{ 
                  width: '100%', 
                  maxWidth: '560px',
                  aspectRatio: '16/9',
                  bgcolor: 'grey.100'
                }}
              >
                <iframe
                  src={preview}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video preview"
                />
              </Box>
            </Box>
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

          <FormControlLabel
            control={
              <Switch
                checked={formData.autoplay}
                onChange={handleChange('autoplay')}
              />
            }
            label={
              <Box>
                <Typography>Autoplay</Typography>
                <Typography variant="caption" color="text.secondary">
                  Note: Autoplay may be blocked by browser settings
                </Typography>
              </Box>
            }
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.videoUrl || !!error}
        >
          Add Video
        </Button>
      </DialogActions>
    </Dialog>
  )
}
