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
import { useDispatch } from 'react-redux';
import { CloudUpload } from '@mui/icons-material';

export default function ImageModal({ open, handleClose }) {
  const dispatch = useDispatch();
  
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
  
    dispatch(addImageElement({
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      imageSource: formData.imageSource,
      altText: formData.altText
    }));
  
    handleClose();
    // Reset form
    setFormData({
      width: 0.5,
      height: 0.5,
      imageSource: '',
      altText: '',
      uploadMethod: 'url'
    });
    setPreviewUrl('');
    setError('');
  };
  return (
    <div>ImageModal</div>
  )
}
