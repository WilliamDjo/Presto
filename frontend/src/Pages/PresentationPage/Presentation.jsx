import { Typography, CssBaseline, TextField, Box, Button, IconButton, Divider } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft, ArrowRight, ArrowLeft } from '@mui/icons-material';
import AspectRatio from '@mui/joy/AspectRatio';
import { fetchRequest } from '../../HelperFiles/helper';

const scale = 5;

const PresentationPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [presentation, setPresentation] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [slideWidth, setSlideWidth] = useState(100);
  const [slideHeight, setSlideHeight] = useState(100);
  const slideContainerRef = useRef(null);
  const slideRef = useRef(null);

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

      <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100vh", justifyContent: "center"}}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: 'primary.main', color: 'white', gap: 2, minHeight: 100 }}>
          <Button color="white">Back</Button>
          <TextField
            label="Presentation Title"
            value={presentationTitle}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => setPresentationTitle(e.target.value)}
            onBlur={(e) => {
              if (!e.target.value) setPresentationTitle("Untitled Presentation");
            }}
            sx={{
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: "white" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'white', borderWidth: 2 },
                '&.Mui-focused fieldset': { borderColor: 'white', borderWidth: 3 },
              },
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{saveStatus}</Typography>
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
        <Box p={2} ref={slideContainerRef} sx={{ display: "flex", justifyContent: "center", height: "100%", overflowY: 'auto', overflowX: 'auto' }}>
          <Box ref={slideRef} height={slideHeight} width={slideWidth} sx={{ backgroundColor: "grey"}}>
            <Typography>
              Hello
            </Typography>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "grey", width: "100%", minHeight: 100 }}>
          <IconButton>
            <ArrowLeft />
          </IconButton>
          <IconButton>
            <ArrowRight />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default PresentationPage;
