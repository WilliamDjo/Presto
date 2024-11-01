// CustomButton.js
import { Button } from '@mui/material';

const CustomButton = ({ text, onClick, variant = 'contained', color = 'primary', size = 'large',fullWidth = true, sx = {} }) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={ {...sx} }
    >
      {text}
    </Button>
  );
};

export default CustomButton;
