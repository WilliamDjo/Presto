// CustomButton.js
import { Button } from '@mui/material';

const CustomButton = ({ text, onClick, variant = 'contained', color = 'primary', size = 'large', fullWidth = true, sx = {}, type = 'submit', startIcon = null, dataTestId = null}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={{ ...sx }}
      type={type}
      startIcon={startIcon}
      data-testid={dataTestId}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
