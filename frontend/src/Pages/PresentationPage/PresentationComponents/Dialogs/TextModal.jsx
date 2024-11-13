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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addTextElement, updateTextElement } from '../../../../State/presentationsSlice';
import FONT_FAMILIES from '../../../../HelperFiles/fonts';

export default function TextModal({ open, handleClose, initialData, isEditing = false }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState(initialData || {
    width: 0.5,
    height: 0.5,
    text: '',
    fontSize: 1,
    color: '#000000',
    fontFamily: 'Arial' // Default font
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
    const elementData = {
      elementSize: {
        x: formData.width,
        y: formData.height
      },
      text: formData.text,
      fontSize: `${formData.fontSize}em`,
      color: formData.color,
      fontFamily: formData.fontFamily || 'Arial',
      fontWeight: "normal",
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left"
    };

    if (isEditing) {
      dispatch(updateTextElement({
        index: formData.index,
        attributes: elementData
      }));
    } else {
      dispatch(addTextElement({
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
        text: '',
        fontSize: 1,
        color: '#000000',
        fontFamily: 'Arial'
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Text Element' : 'Add Text Element'}</DialogTitle>
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
            sx={{
              '& .MuiInputBase-input': {
                fontFamily: formData.fontFamily // Apply selected font to input
              }
            }}
          />
          {/* Font Family Selection */}
          <FormControl fullWidth>
            <InputLabel id="font-family-label">Font Family</InputLabel>
            <Select
              labelId="font-family-label"
              value={formData.fontFamily}
              onChange={handleChange('fontFamily')}
              label="Font Family"
            >
              {FONT_FAMILIES.map((font) => (
                <MenuItem 
                  key={font.value} 
                  value={font.value}
                  sx={{ 
                    fontFamily: font.value,
                    fontSize: '16px' // Make the preview text a good size
                  }}
                >
                  {font.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
          {isEditing ? 'Save Changes' : 'Add Text Element'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
