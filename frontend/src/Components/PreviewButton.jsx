import { IconButton, Tooltip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { getCurrentSlideNum, getCurrentPresentationId } from '../HelperFiles/helper';

export default function PreviewButton() {
  const handlePreview = () => {
    const presentationId = getCurrentPresentationId();
    const currentSlide = getCurrentSlideNum() || "1";
    const previewUrl = `/preview/${presentationId}#/${currentSlide}`;
    window.open(previewUrl, '_blank');
    console.log("Previewing presentation");
    
  };
  
  return (
    <Tooltip title="Preview Presentation">
      <IconButton
        onClick={handlePreview}
        sx={{
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <PreviewIcon />
      </IconButton>
    </Tooltip>
  );
}
