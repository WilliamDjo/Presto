import { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSlides, getSlideByPosition } from '../../../HelperFiles/helper';
import Block from '../SlideDisplay/SlideDisplayComponents/Block';


export default function PresentationPreview() {
  const presentations = useSelector((state) => state.presentations.presentations);
  const navigate = useNavigate();
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const currentSlide = parseInt(location.hash.split("/")[1]) || 1;
  
  const updateDimensions = () => {
    if (slideRef.current) {
      const padding = parseFloat(window.getComputedStyle(slideContainerRef.current).padding);
  
      if ((slideRef.current.offsetWidth === slideContainerRef.current.offsetWidth - padding * 2) && (slideRef.current.offsetHeight <= slideContainerRef.current.offsetHeight - padding * 2)) {
        setSlideHeight((slideContainerRef.current.offsetWidth - padding * 2) * (9/16));
        setSlideWidth(slideContainerRef.current.offsetWidth - padding * 2);
      } else {
        setSlideHeight(slideContainerRef.current.offsetHeight - padding * 2);
        setSlideWidth((slideContainerRef.current.offsetHeight - padding * 2) * (16/9));
      }
    }
  };
  
  useEffect(() => {
    updateDimensions();
  
    window.addEventListener("resize", () => updateDimensions());
    return () => window.removeEventListener("resize", () => updateDimensions());
  }, [slideHeight, slideWidth]);
  
  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key === 'ArrowLeft' && currentSlide > 1) {
        navigate(`#/${currentSlide - 1}`);
      }
      if (e.key === 'ArrowRight' && currentSlide < getSlides(presentations)?.length) {
        navigate(`#/${currentSlide + 1}`);
      }
    };
  
    document.addEventListener("keydown", handleKeyboardInput);
    return () => document.removeEventListener("keydown", handleKeyboardInput);
  }, [currentSlide, presentations, navigate]);
  
  const renderTextContent = (element) => {
    if (!element.attributes) return null;
      
    return (
      <Typography
        sx={{
          width: '100%',
          height: '100%',
          padding: '8px',
          fontSize: `${element.attributes.fontSize}em`,
          color: element.attributes.textColor,
          fontFamily: element.attributes.fontFamily || 'Arial',
          wordBreak: 'break-word',
          overflow: 'hidden'
        }}
      >
        {element.attributes.textContent}
      </Typography>
    );
  };
  
  return (
    <>
      <Box p={2} ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: '95vw', height: "95vh" , overflowY: 'hidden', overflowX: 'hidden' }}>
        <Box ref={slideRef} height={slideHeight} width={slideWidth} sx={{ position: "relative", backgroundColor: "white"}}>
          <Box sx={{height: "100%", width: "100%"}}>
            {getSlideByPosition(presentations, currentSlide)?.contents.map((element) => (
              <Block 
                interactable={false} 
                parentHeight={slideHeight} 
                parentWidth={slideWidth} 
                key={element.index} 
                index={element.index} 
                slideNum={currentSlide}
                preview={true}
              >
                {renderTextContent(element)}
              </Block>
            ))}
  
            <Typography m={1} sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              zIndex: 999,
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "2px 5px",
              borderRadius: "15px",
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.5)",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
              opacity: 0.5
            }}>
              {currentSlide}
            </Typography>
          </Box>
        </Box>
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
          borderRadius: '20px',
          zIndex: 1000
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
    </>
  );
}
