import { Typography, CssBaseline, Box, IconButton, Divider } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft, Settings, Delete } from '@mui/icons-material';
import { fetchRequest } from '../../HelperFiles/helper';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton';
import SlidesBar from './PresentationComponents/SlidesBar';

const PresentationPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [presentation, setPresentation] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);
  const navigate = useNavigate();

  const updateDimensions = (e) => {
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
    return (e) => window.removeEventListener("resize", (e) => updateDimensions(e));
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

  return (
    <>
      <CssBaseline />

      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", justifyContent: "center", backgroundColor: "#f5f5f5"}}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2, backgroundColor: 'primary.main', color: 'white', gap: 2, minHeight: 100 }}>
          <Box sx={{display: "flex", alignItems: "center", gap: 2}}>
            <BackButton onClick={() => navigate("/dashboard")} />
            <Image>

            </Image>
            <Box sx={{display: "flex", flexDirection: "column"}}>
              <Box sx={{display: "flex", gap: 0.5}}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{presentationTitle}</Typography>
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
        </Box>

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
    </>
  );
};

export default PresentationPage;
