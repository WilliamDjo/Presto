import { Box, IconButton, Divider } from "@mui/material";
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import { addTextElement } from "../../../State/presentationsSlice";
import TextModal from "../PresentationComponents/Dialogs/TextModal";
import ImageModal from "../PresentationComponents/Dialogs/ImageModal";
import VideoModal from "../PresentationComponents/Dialogs/VideoModal";
import CodeModal from "../PresentationComponents/Dialogs/CodeModal";
import { useState } from "react";

const Toolbar = () => {
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);

  return (
    <>
      <Box
        m={2}
        sx={{
          position: "fixed",
          width: '60px',
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: 3,
          padding: 1,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton 
          onClick={() => setTextModalOpen(true)}
          sx={{ color: 'primary.main' }}
          title="Add Text Element"
        >
          <Notes />
        </IconButton>
        <IconButton 
          onClick={() => setImageModalOpen(true)}
          sx={{ color: 'primary.main' }}>
          <Image />
        </IconButton>
        <IconButton         
          onClick={() => setVideoModalOpen(true)}
          sx={{ color: 'primary.main' }}
          title="Add Video Element">
          <VideoLibrary />
        </IconButton>
        <IconButton          
          onClick={() => setCodeModalOpen(true)}
          sx={{ color: 'primary.main' }}
          title="Add Code Element">
          <Code />
        </IconButton>
        <Divider sx={{ width: '100%', bgcolor: 'primary.main' }} />
        <IconButton sx={{ backgroundColor: 'primary.main' }} >
          <KeyboardDoubleArrowLeft sx={{ color: 'white' }}/>
        </IconButton>
      </Box>
      <TextModal 
        open={textModalOpen}
        handleClose={() => setTextModalOpen(false)}
      />
      <ImageModal 
        open={imageModalOpen}
        handleClose={() => setImageModalOpen(false)}
      />

      <VideoModal 
        open={videoModalOpen}
        handleClose={() => setVideoModalOpen(false)}
      />

      <CodeModal 
        open={codeModalOpen}
        handleClose={() => setCodeModalOpen(false)}
      />
    </>
  )
};

export default Toolbar;
