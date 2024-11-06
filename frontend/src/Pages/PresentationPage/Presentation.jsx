import { Typography, CssBaseline, Box, IconButton, Divider } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft} from '@mui/icons-material';
import { fetchRequest } from '../../HelperFiles/helper';
import { useNavigate } from 'react-router-dom';
// import BackButton from '../../Components/BackButton';
import SlidesBar from './PresentationComponents/SlidesBar';
import DeleteDialog from './PresentationComponents/DeleteDialog';
import SettingsDialog from './PresentationComponents/SettingsDialog';
import Header from './PresentationComponents/Header';


const PresentationPage = () => {
  const [, setPresentations] = useState([]);
  const [presentation, setPresentation] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [newTitle, setNewTitle] = useState(presentationTitle);
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const navigate = useNavigate();

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
    const fetchStore = async () => {
      const res = await fetchRequest('/store', 'get', null, localStorage.getItem('token'), null);
      setPresentations(res.store.presentations);
      setPresentation(res.store.presentations.find(pres => pres.id == location.pathname.split('/')[2]));
      setPresentationTitle(res.store.presentations.find(pres => pres.id == location.pathname.split('/')[2]).title);
    }

    fetchStore();
  }, []);

  const buildPresentations = () => {};

  useEffect(() => {
    setSaveStatus("Saving...");
    const savePresentation = async () => {
      buildPresentations();
      console.log('hi');
      setSaveStatus("Saved");
    }

    savePresentation();
  }, [presentationTitle]);

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

      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", justifyContent: "center", backgroundColor: "#f5f5f5"}}>
        {/* Header */}
        <Header 
          title={presentationTitle}
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
          <Box ref={slideRef} height={slideHeight} width={slideWidth} border={1} sx={{ backgroundColor: "white"}}>
            <Typography sx={{position: "relative", top: "50%", left: "50%", width: "50%", height: "50%", backgroundColor: "green"}}>
              Hello
            </Typography>
          </Box>
        </Box>

        <SlidesBar slides={presentation?.slides} />
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
