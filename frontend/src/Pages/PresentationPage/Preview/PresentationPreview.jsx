import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, IconButton, Typography, CssBaseline } from '@mui/material';
import { ArrowRight, ArrowLeft, Fullscreen, FullscreenExit } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSlides, getSlideByPosition, renderBackground, getPresentation, renderPreviewBackground, getCurrentSlideNum, getPreviewVersion } from '../../../HelperFiles/helper';
import Block from '../SlideDisplay/SlideDisplayComponents/Block';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export default function PresentationPreview() {
  const presentations = useSelector((state) => state.presentations.presentations);
  const navigate = useNavigate();
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const currentSlide = parseInt(getCurrentSlideNum()) || 1;

  const [showControls, setShowControls] = useState(true);
  const [animation, setAnimation] = useState(fadeIn);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const inactivityTimeout = useRef(null);
  const [fadeOutActive, setFadeOutActive] = useState(false); // State to control fade-out
  
  let version;
  if (getPreviewVersion()) {
    version = getPresentation(presentations)?.versionHistory.find((version) => version.dateTime == getPreviewVersion());
  }
  const background = version ? renderPreviewBackground(version, parseInt(getCurrentSlideNum())) : renderBackground(presentations, parseInt(getCurrentSlideNum()));

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

  const handleAdvanceSlide = useCallback(() => {
    const currSlide = version ? version.slides[parseInt(getCurrentSlideNum()) - 1] : getSlideByPosition(presentations, parseInt(getCurrentSlideNum()));

    switch (currSlide.transition) {
    case "fade":
      setFadeOutActive(true);
      setTimeout(() => {
        setFadeOutActive(false);
        navigate(version ? `#/${currentSlide + 1}/${getPreviewVersion()}` : `#/${currentSlide + 1}`);
      }, 500);
      break;

    default:
      navigate(version ? `#/${currentSlide + 1}/${getPreviewVersion()}` : `#/${currentSlide + 1}`);
    }
  }, [currentSlide, navigate, presentations, version]);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [slideHeight, slideWidth]);

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key === 'ArrowLeft' && currentSlide > 1) {
        navigate(version ? `#/${currentSlide - 1}/${getPreviewVersion()}` : `#/${currentSlide - 1}`);
      }
      if ((e.key === 'ArrowRight' || e.code === 'Space') && currentSlide < (version ? version.slides.length : getSlides(presentations)?.length)) {
        handleAdvanceSlide();
      }
    };
    const handleClickInput = () => {
      if (currentSlide < (version ? version.slides.length : getSlides(presentations)?.length)) {
        handleAdvanceSlide();
      }
    };

    document.addEventListener("keydown", handleKeyboardInput);
    window.addEventListener("click", handleClickInput);
    return () => {
      document.removeEventListener("keydown", handleKeyboardInput);
      window.removeEventListener("click", handleClickInput);
    }
  }, [currentSlide, presentations, navigate, handleAdvanceSlide, version]);

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

  // Hide controls and cursor after 3 seconds of inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setAnimation(fadeIn); // Set fade-in animation
      setShowControls(true); // Show controls
      document.body.style.cursor = 'default'; // Show cursor on mouse move

      clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(() => {
        setAnimation(fadeOut); // Set fade-out animation
        setTimeout(() => {
          setShowControls(false); // Hide controls after fade-out completes
          document.body.style.cursor = 'none'; // Hide cursor when controls disappear
        }, 490); // 500ms matches fade-out animation duration
      }, 3000);
    };

    // Show controls and cursor initially
    handleMouseMove();

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(inactivityTimeout.current);
    };
  }, []);

  // Toggle fullscreen mode
  const toggleFullscreen = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up
  
    if (!isFullscreen) {
      if (slideContainerRef.current.requestFullscreen) {
        slideContainerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events to update fullscreen state and handle ESC
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);

      if (!isInFullscreen) {
        setShowControls(true); // Show controls when exiting fullscreen
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <Box ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: '100vw', height: "100vh" , overflowY: 'hidden', overflowX: 'hidden', backgroundColor: "black" }}>
        <Box ref={slideRef} height={slideHeight} width={slideWidth} sx={{position: "relative", backgroundColor: "white", animation: `${fadeOutActive ? fadeOut : fadeIn} 0.5s`}}>
          <Box sx={{height: "100%", width: "100%", ...background}}>
            {(version ? version?.slides[parseInt(getCurrentSlideNum()) - 1] : getSlideByPosition(presentations, currentSlide))?.contents.map((element) => (
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

            {/* Navigation Controls */}
            <Box
              sx={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: showControls ? 'flex' : 'none',
                alignItems: 'center',
                gap: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '8px 16px',
                borderRadius: '20px',
                zIndex: 1000,
                animation: `${animation} 0.5s`, // Apply fade-in or fade-out animation
                minWidth: "235px"
              }}
            >
              <IconButton
                title="View Previous Slide"
                disabled={currentSlide === 1}
                onClick={(e) => {e.stopPropagation(); navigate(version ? `#/${currentSlide - 1}/${getPreviewVersion()}` : `#/${currentSlide - 1}`);}}
                sx={{ color: 'white' }}
              >
                <ArrowLeft />
              </IconButton>
              <Box sx={{ color: 'white', fontSize: '1rem' }}>
                {currentSlide} / {version ? version?.slides.length : getSlides(presentations)?.length}
              </Box>
              <IconButton
                title="View Next Slide"
                disabled={currentSlide === (version ? version?.slides.length : getSlides(presentations)?.length)}
                onClick={(e) => {e.stopPropagation(); handleAdvanceSlide();}}
                sx={{ color: 'white' }}
              >
                <ArrowRight />
              </IconButton>
              <IconButton title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"} onClick={toggleFullscreen} sx={{ color: 'white' }}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
