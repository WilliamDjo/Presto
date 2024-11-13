import { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSlides, getSlideByPosition } from '../../../HelperFiles/helper';
import Block from '../SlideDisplay/SlideDisplayComponents/Block';


export default function PresentationPreview() {
  const presentations = useSelector((state) => state.presentations.presentations);
  const navigate = useNavigate();
  const currentSlide = parseInt(location.hash.split("/")[1]) || 1;
  
  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key === 'ArrowLeft' && currentSlide > 1) {
        navigate(`#/${currentSlide - 1}`);
      }
      if (e.key === 'ArrowRight' && currentSlide < getSlides(presentations).length) {
        navigate(`#/${currentSlide + 1}`);
      }
    };
  
    document.addEventListener("keydown", handleKeyboardInput);
    return () => document.removeEventListener("keydown", handleKeyboardInput);
  }, [currentSlide, presentations, navigate]);
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {/* Slide Container */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {/* Current Slide */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          {getSlideByPosition(presentations, currentSlide)?.contents.map((element) => (
            <Block
              key={element.index}
              index={element.index}
              slideNum={currentSlide}
              interactable={false}
              preview={true}
            />
          ))}
        </Box>

        {/* Navigation Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}
        >
          <IconButton
            disabled={currentSlide === 1}
            onClick={() => navigate(`#/${currentSlide - 1}`)}
            sx={{ color: 'white' }}
          >
            <ArrowLeft />
          </IconButton>
          <Box sx={{ color: 'white', fontSize: '1rem' }}>
            {currentSlide} / {getSlides(presentations)?.length}
          </Box>
          <IconButton
            disabled={currentSlide === getSlides(presentations)?.length}
            onClick={() => navigate(`#/${currentSlide + 1}`)}
            sx={{ color: 'white' }}
          >
            <ArrowRight />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
