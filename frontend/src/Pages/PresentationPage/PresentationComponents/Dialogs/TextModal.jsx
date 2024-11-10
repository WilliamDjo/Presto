import{ useState } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Slider,
  InputAdornment
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addTextElement } from '../../../State/presentationsSlice';

export default function TextModal({ open, handleClose }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    width: 0.5,
    height: 0.5,
    text: '',
    fontSize: 1,
    color: '#000000'
  });
  
  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };
  
  const handleSliderChange = (field) => (event, newValue) => {
    setFormData({
      ...formData,
      [field]: newValue
    });
  };
  
  const handleSubmit = () => {
    dispatch(addTextElement({
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      textContent: formData.text,
      fontSize: formData.fontSize,
      textColor: formData.color,
      fontFamily: "Arial"
    }));
    handleClose();
    // Reset form
    setFormData({
      width: 0.5,
      height: 0.5,
      text: '',
      fontSize: 1,
      color: '#000000'
    });
  };

  return (
    <div>TextModal</div>
  )
}
