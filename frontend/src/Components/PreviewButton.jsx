import { IconButton, Tooltip } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
// import { useSelector } from 'react-redux';
// import { getSlides } from '../HelperFiles/helper';

export default function PreviewButton() {
//   const presentations = useSelector((state) => state.presentations.presentations);
  
  const handlePreview = () => {
    // const currentPath = location.pathname;
    // const currentSlide = location.hash.split("/")[1] || "1";
    // const previewUrl = `${currentPath}/preview#/${currentSlide}`;
    // window.open(previewUrl, '_blank');
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
