import { Typography, CssBaseline, TextField, Box, Button, IconButton, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { Notes, Image, VideoLibrary, Code, KeyboardDoubleArrowLeft, ArrowRight, ArrowLeft } from '@mui/icons-material';

const PresentationPage = () => {
  const [presentations, setPresentations] = useState([]);
  const [presentation, setPresentation] = useState(null);
  const [presentationTitle, setPresentationTitle] = useState("");
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [scale, setScale] = useState(1); // Scale state for zoom
  const [startDistance, setStartDistance] = useState(null); // Start distance for pinch

  // Touch event handlers for pinch-to-zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setStartDistance(distance);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && startDistance) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      const newScale = scale * (distance / startDistance);
      setScale(Math.min(Math.max(newScale, 1), 3)); // Limit scale between 1x and 3x
    }
  };

  const getDistance = (touch1, touch2) => {
    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  return (
    <>
      <CssBaseline />

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2, backgroundColor: 'primary.main', color: 'white', gap: 2 }}>
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

      <Box sx={{ display: "flex", alignItems: "center" }}>
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
        <Box
          m={2}
          sx={{
            width: "100%",
            backgroundColor: "grey",
            paddingTop: "56.25%", // 16:9 aspect ratio
            maxHeight: "10%",
            transform: `scale(${scale})`, // Apply scale here
            transformOrigin: 'center', // Keep scaling centered
            overflow: 'hidden', // Prevent overflow during scaling
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            Slides
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", backgroundColor: "grey", width: "100%", height: 100 }}>
        <IconButton>
          <ArrowLeft />
        </IconButton>
        <IconButton>
          <ArrowRight />
        </IconButton>
      </Box>
    </>
  );
};

export default PresentationPage;
