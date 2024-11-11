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
import { addTextElement } from '../../../../State/presentationsSlice';

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
      text: formData.text,
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      fontSize: `${formData.fontSize}em`,
      color: formData.color,
      fontFamily: "Arial",
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left"
    }));
    console.log('Text uploaded');
    
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Text Element</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
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
            multiline
            rows={4}
            label="Text Content"
            value={formData.text}
            onChange={handleChange('text')}
          />

          <TextField
            fullWidth
            type="number"
            label="Font Size"
            value={formData.fontSize}
            onChange={handleChange('fontSize')}
            InputProps={{
              endAdornment: <InputAdornment position="end">em</InputAdornment>,
              inputProps: { min: 0.1, step: 0.1 }
            }}
          />

          <TextField
            fullWidth
            label="Text Color"
            type="color"
            value={formData.color}
            onChange={handleChange('color')}
            InputProps={{
              startAdornment: <InputAdornment position="start">#</InputAdornment>
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.text.trim()}
        >
          Add Text Element
        </Button>
      </DialogActions>
    </Dialog>
  );
}
