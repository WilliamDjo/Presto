import { Box, IconButton, Divider } from "@mui/material";
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import { addTextElement } from "../../../State/presentationsSlice";
import TextModal from "../PresentationComponents/Dialogs/TextModal";
import { useState } from "react";

const Toolbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

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
          onClick={handleOpenModal}
          sx={{ color: 'primary.main' }}
          title="Add Text Element"
        >
          <Notes />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <Image />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <VideoLibrary />
        </IconButton>
        <IconButton sx={{ color: 'primary.main' }}>
          <Code />
        </IconButton>
        <Divider sx={{ width: '100%', bgcolor: 'primary.main' }} />
        <IconButton sx={{ backgroundColor: 'primary.main' }} >
          <KeyboardDoubleArrowLeft sx={{ color: 'white' }}/>
        </IconButton>
      </Box>
      <TextModal 
        open={isModalOpen}
        handleClose={handleCloseModal}
      />
    </>
  )
};

export default Toolbar;
