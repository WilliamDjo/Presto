import { Box, Typography } from "@mui/material";
import Block from "./SlideDisplayComponents/Block";
import { useRef, useState, useEffect } from "react";
import { getSlideByPosition, getSlides, renderBackground } from "../../../HelperFiles/helper";
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
    updateDimensions();

    window.addEventListener("resize", () => updateDimensions());
    return () => window.removeEventListener("resize", () => updateDimensions());
  }, [slideHeight, slideWidth]);

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
    <Box p={2} ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflowY: 'auto', overflowX: 'auto' }}>
      <Box ref={slideRef} height={slideHeight} width={slideWidth} border={1} sx={{ position: "relative" }}>
        <Box sx={{height: "100%", width: "100%", ...renderBackground(presentations)}}>
          {getSlideByPosition(presentations, parseInt(location.hash.split("/")[1]))?.contents.map((element) => (
            <Block interactable={true} parentHeight={slideHeight - 2} parentWidth={slideWidth - 2} key={element.index} index={element.index} slideNum={parseInt(location.hash.split("/")[1])} >
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
            {parseInt(location.hash.split("/")[1]) >= 1 && parseInt(location.hash.split("/")[1]) <= getSlides(presentations)?.length ? parseInt(location.hash.split("/")[1]) : ""}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SlideDisplay;
