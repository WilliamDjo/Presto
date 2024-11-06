import { Button, IconButton } from '@mui/material';
import { ArrowBackIosNew } from '@mui/icons-material';

const BackButton = ({ onClick, color="white", sx = {} }) => {
  return (
    <Button
      color={color}
      onClick={onClick}
      sx={{ ...sx }}
    >
        <ArrowBackIosNew />
    </Button>
  );
};

export default BackButton;
