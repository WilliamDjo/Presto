import { CssBaseline, Box, IconButton, Divider } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { getPresentationTitle } from '../../HelperFiles/helper';
import { useNavigate } from 'react-router-dom';
import SlidesBar from './PresentationComponents/SlidesBar';
import DeleteDialog from './PresentationComponents/DeleteDialog';
import SettingsDialog from './PresentationComponents/SettingsDialog';
import Header from './PresentationComponents/Header';
import Block from '../../Components/Block';
import { useSelector, useDispatch } from 'react-redux';
import { savePresentations } from '../../State/presentationsSlice';

const PresentationPage = () => {
  const presentations = useSelector((state) => state.presentations.presentations);
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(getPresentationTitle(presentations));
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  const saveStatus = useSelector((state) => state.saveStatus) ? "Saved" : "Saving...";
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(savePresentations());
  }, [presentations, dispatch]);

  const handleDelete = () => {

    setShowDeleteDialog(false);
    // onDelete();
  };

  const handleSave = () => {
    // onTitleChange(newTitle);
    // onThumbnailChange(previewThumbnail);
    setShowSettingsDialog(false);
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewThumbnail(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <CssBaseline />

      <Box sx={{display: "flex", flexDirection: "column", height: "100vh", justifyContent: "center", backgroundColor: "#f5f5f5"}}>
        {/* Header */}
        {/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, backgroundColor: 'primary.main', color: 'white', gap: 2, minHeight: 100 }}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <BackButton onClick={() => navigate("/dashboard")} />
            <Image>

            </Image>
            <Box sx={{display: "flex", flexDirection: "column"}}>
              <Box sx={{display: "flex", gap: 0.5}}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{getPresentationTitle(presentations)}</Typography>
                <IconButton size="small" sx={{color: "white"}}>
                  <Settings />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "semi-bold" }}>{saveStatus}</Typography>
            </Box>
          </Box>

          <Box>
            <IconButton>
              <Delete sx={{color: "white"}}/>
            </IconButton>
          </Box>
        </Box> */}
        <Header 
          title={getPresentationTitle(presentations)}
          saveStatus={saveStatus}
          onBackClick={() => navigate("/dashboard")}
          onSettingsClick={() => setShowSettingsDialog(true)}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

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
          <IconButton sx={{ color: 'primary.main' }}>
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

        {/* Central Box */}
        <Box p={2} ref={slideContainerRef} sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflowY: 'auto', overflowX: 'auto' }}>
          <Box ref={slideRef} height={slideHeight} width={slideWidth} border={1} sx={{ position: "relative", backgroundColor: "white"}}>
            <Block
              initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}
        
            ><p>Text Block</p></Block>
            <Block initialWidth={100} initialHeight={100} initialX={150} initialY={205} styles={{ backgroundColor: "lightblue" }}>
              <p>Text Block</p>
            </Block>
          </Box>
        </Box>

        <SlidesBar />
      </Box>

      <DeleteDialog 
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />

      <SettingsDialog 
        open={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        onSave={handleSave}
        title={newTitle}
        thumbnail={previewThumbnail}
        onTitleChange={setNewTitle}
        onThumbnailChange={handleThumbnailChange}
      />
    </>
  );
};

export default PresentationPage;
