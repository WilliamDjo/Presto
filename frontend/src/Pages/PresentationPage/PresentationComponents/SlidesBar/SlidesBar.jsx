import { Box, IconButton } from "@mui/material";
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import SlidesBarComponent from "./SlidesBarComponent";
import AddSlidesBarComponent from "./AddSlidesBarComponent";
import { useSelector } from 'react-redux';
import { getSlides } from "../../../../HelperFiles/helper";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SlidesBar = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyboardInput = (e) => {
      if (e.key === 'ArrowLeft' && parseInt(location.hash.split("/")[1]) > 1) {
        navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`)
      }
      if (e.key === 'ArrowRight' && parseInt(location.hash.split("/")[1]) < getSlides(presentations).length) {
        navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) + 1}`)
      }
    }

    document.addEventListener("keydown", handleKeyboardInput);
    return () => document.removeEventListener("keydown", handleKeyboardInput);
  }, [presentations, navigate]);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "primary.main", width: "100%", minHeight: 150 }}>
      <IconButton disabled={location.hash.split("/")[1] == 1} onClick={() => {navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) - 1}`)}} sx={{ color: 'white' }}>
        <ArrowLeft />
      </IconButton >
      <Box sx={{display: "flex", alignItems: "center", gap: "2%", width: "100%", height: "100%", overflowX: "auto"}}>
        {getSlides(presentations)?.map((slide) => (
          <SlidesBarComponent key={slide.slideNum} index={slide.slideNum} />
        ))}
        
        <AddSlidesBarComponent />
      </Box>
      <IconButton disabled={location.hash.split("/")[1] == getSlides(presentations)?.length} onClick={() => {navigate(`${location.pathname}#/${parseInt(location.hash.split("/")[1]) + 1}`)}} sx={{ color: 'white' }}>
        <ArrowRight />
      </IconButton>
    </Box>
  );
}

export default SlidesBar;
