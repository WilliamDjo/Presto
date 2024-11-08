import { Box, Typography } from "@mui/material";
import Block from "../../../Components/Block";
import { useRef, useState, useEffect } from "react";
import { getSlides } from "../../../HelperFiles/helper";
import { useSelector } from "react-redux";

const SlideDisplay = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);

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
    const padding = parseFloat(window.getComputedStyle(slideContainerRef.current).padding)
    setSlideHeight(slideContainerRef.current.offsetHeight - padding * 2);
    setSlideWidth((slideContainerRef.current.offsetHeight - padding * 2) * (16/9));
    updateDimensions();

    window.addEventListener("resize", (e) => updateDimensions(e));
    return () => window.removeEventListener("resize", (e) => updateDimensions(e));
  }, []);

  const getContrastColor = (bgColor) => {
    // Remove hash if it's a hex color
    if (bgColor.startsWith('#')) {
      bgColor = bgColor.slice(1);
    }
  
    // Convert hex to RGB
    const r = parseInt(bgColor.substr(0, 2), 16);
    const g = parseInt(bgColor.substr(2, 2), 16);
    const b = parseInt(bgColor.substr(4, 2), 16);
  
    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
    // Return white for dark backgrounds, black for light backgrounds
    return brightness > 128 ? 'black' : 'white';
  };

  return (
    <Box p={2} ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflowY: 'auto', overflowX: 'auto' }}>
      <Box ref={slideRef} height={slideHeight} width={slideWidth} border={1} sx={{ position: "relative", backgroundColor: "white"}}>
        <Block
          initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}>
          <p>Text Block</p></Block>
        <Block initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}>
          <p>Text Block</p>
        </Block>
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
          {parseInt(location.hash.split("/")[1]) >= 1 && parseInt(location.hash.split("/")[1]) <= getSlides(presentations)?.length ? parseInt(location.hash.split("/")[1]) : ""}
        </Typography>
      </Box>
    </Box>
  );
};

export default SlideDisplay;
