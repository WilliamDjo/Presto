import { Box } from '@mui/material';
import { Image } from '@mui/icons-material';

const ThumbnailDisplay = ({ thumbnail, size = 40 }) => {
  if (!thumbnail) {
    return <Image />;
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