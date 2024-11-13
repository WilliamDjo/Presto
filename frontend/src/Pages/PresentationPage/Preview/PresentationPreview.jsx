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
    <div>PresentationPreview</div>
  )
}
