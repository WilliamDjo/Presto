import { Box, IconButton } from "@mui/material";
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import SlidesBarComponent from "./SlidePanelsBar/SlidesBarComponent";
import AddSlidesBarComponent from "./SlidePanelsBar/AddSlidesBarComponent";
import { useSelector } from 'react-redux';
import { getSlides } from "../../../HelperFiles/helper";

const SlidesBar = () => {
  // slides = [
  //   {
  //     slideNum: 1
  //   },
  //   {
  //     slideNum: 2
  //   },
  //   {
  //     slideNum: 3
  //   }
  // ]

  const presentations = useSelector((state) => state.presentations.presentations);

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "primary.main", width: "100%", minHeight: 150 }}>
      <IconButton disabled={location.hash.split("/")[1] == 1} sx={{ color: 'white' }}>
        <ArrowLeft />
      </IconButton >
      <Box sx={{display: "flex", alignItems: "center", gap: "2%", width: "100%", height: "100%", overflowX: "auto"}}>
        {getSlides(presentations)?.map((slide) => (
          <SlidesBarComponent key={slide.slideNum} index={slide.slideNum} />
        ))}
        
        <AddSlidesBarComponent />
      </Box>
      <IconButton disabled={location.hash.split("/")[1] == getSlides(presentations)?.length} sx={{ color: 'white' }}>
        <ArrowRight />
      </IconButton>
    </Box>
  );
}

export default SlidesBar;
