import { IconButton } from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';

const BackButton = ({ onClick, color="white", sx = {} }) => {
  return (
    <IconButton
      color={color}
      onClick={onClick}
      sx={{ 
        ...sx,
        color: {color},
        '&:hover': { 
          backgroundColor: '#f0f0f0'
        }}}
    >
      <ArrowBackIosNew />
    </IconButton>
  );
};

export default BackButton;
