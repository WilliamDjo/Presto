import { Box, IconButton } from "@mui/material";
import { ArrowRight, ArrowLeft } from '@mui/icons-material';
import SlidesBarComponent from "./SlidePanelsBar/SlidesBarComponent";
import AddSlidesBarComponent from "./SlidePanelsBar/AddSlidesBarComponent";

const SlidesBar = ({ slides }) => {
    console.log(slides);

    return (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "primary.main", width: "100%", minHeight: 150 }}>
          <IconButton sx={{ color: 'white' }}>
            <ArrowLeft />
          </IconButton >
          <Box sx={{display: "flex", alignItems: "center", gap: "2%", width: "100%", height: "100%", overflowX: "auto"}}>
          {slides?.map((slide) => (
            <SlidesBarComponent key={slide.slideNum} index={slide.slideNum} />
          ))}
            
            <AddSlidesBarComponent />
          </Box>
          <IconButton sx={{ color: 'white' }}>
            <ArrowRight />
          </IconButton>
        </Box>
    );
}

export default SlidesBar;
