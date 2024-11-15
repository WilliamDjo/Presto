import { Stack, InputLabel, Card, CardActionArea, CardMedia, Typography, Input, Button } from '@mui/material';
import { Image } from '@mui/icons-material';
import { useRef } from 'react';

const ThumbnailUpload = ({ thumbnail, resetThumbnail, onThumbnailChange }) => {
  const fileInputRef = useRef(null);

  const handleCardClick = () => {
    const inputElement = fileInputRef.current?.querySelector('input');
    if (inputElement) {
      inputElement.click();
    }
  };

  // Check if thumbnail is empty or default
  const showDefaultImage = !thumbnail;

  return (
    <Stack spacing={1}>
      <InputLabel>Thumbnail</InputLabel>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onThumbnailChange}
        sx={{ display: 'none' }}
        data-testid="thumbnail-upload-input"
      />
      
      <Card sx={{ width: '100%', maxWidth: 345 }}>
        <CardActionArea onClick={handleCardClick} data-testid="thumbnail-upload">
          {!showDefaultImage ? (
            <CardMedia
              component="img"
              sx={{ height: 194 }}
              image={thumbnail}
              title="Presentation thumbnail"
            />
          ) : (
            <CardMedia
              sx={{
                height: 194,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'grey.100'
              }}
            >
              <Stack alignItems="center" spacing={1}>
                <Image color="action" sx={{ fontSize: 40 }}/>
                <Typography variant="body2" color="text.secondary">
                  Click to add thumbnail
                </Typography>
              </Stack>
            </CardMedia>
          )}
        </CardActionArea>
      </Card>
      
      <Button onClick={resetThumbnail} variant="outlined" color="primary" sx={{ mt: 1 }}>
        Reset
      </Button>
    </Stack>
  );
};

export default ThumbnailUpload;
