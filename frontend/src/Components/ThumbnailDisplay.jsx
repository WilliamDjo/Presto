import { Box } from '@mui/material';
import { Image } from '@mui/icons-material';

const ThumbnailDisplay = ({ thumbnail, size = 40 }) => {
  if (!thumbnail || thumbnail === "Default thumbnail") { // Check for both null/undefined and default value
    return <Image sx={{ width: size, height: size, color: 'white' }} />;
  }

  return (
    <Box
      component="img"
      src={thumbnail}
      sx={{
        width: size,
        height: size,
        objectFit: 'cover',
        borderRadius: 1
      }}
    />
  );
};

export default ThumbnailDisplay;