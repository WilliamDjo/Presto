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

// // Assuming you have an action for adding videos
// const addVideoElement = (videoData) => ({
//     type: 'presentations/addVideoElement',
//     payload: videoData
//   });
  

export default function VideoModal() {
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
  
    handleClose();
    // Reset form
    setFormData({
      width: 0.5,
      height: 0.5,
      videoUrl: '',
      autoplay: false
    });
    setPreview(null);
    setError('');
  };

  return (
    <div>VideoModal</div>
  )
}
