import { Box } from "@mui/material";
import Block from "../../../Components/Block";
import { useRef, useState, useEffect } from "react";

const SlideDisplay = () => {
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

  return (
    <Box p={2} ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflowY: 'auto', overflowX: 'auto' }}>
      <Box ref={slideRef} height={slideHeight} width={slideWidth} border={1} sx={{ position: "relative", backgroundColor: "white"}}>
        <Block
          initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}>
          <p>Text Block</p></Block>
        <Block initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}>
          <p>Text Block</p>
        </Block>
      </Box>
    </Box>
  );
};

export default SlideDisplay;
