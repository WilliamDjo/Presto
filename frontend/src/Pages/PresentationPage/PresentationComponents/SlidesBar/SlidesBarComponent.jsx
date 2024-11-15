import { useEffect, useState, useRef } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Button, Dialog, DialogContent, DialogTitle, DialogActions, Stack, InputLabel, Select, MenuItem, TextField, Card, CardActionArea, CardMedia, Typography, Divider } from '@mui/material';
import { Settings, Delete, Image } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSlide, deletePresentation, updateSlideBackground, updateSlideTranistion } from '../../../../State/presentationsSlice';
import { getSlides, getSlideByPosition, renderBackground, getCurrentSlideNum, getCurrentPresentationId } from '../../../../HelperFiles/helper';
import Block from '../../SlideDisplay/SlideDisplayComponents/Block';
import { DeleteConfirmDialog } from '../Dialogs/DeleteConfirmDialog';

const SlidesBarComponent = ({ id, index }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({animateLayoutChanges: () => false , id });
  const [isDraggingEvent, setIsDraggingEvent] = useState(false);
  const [mousePosition, setMousePosition] = useState(null);
  const [parentDimensions, setParentDimensions] = useState({ width: 0, height: 0 });
  const presentations = useSelector(state => state.presentations.presentations);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const parentRef = useRef(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isLastSlide = getSlides(presentations).length === 1;
  const [openComponentSettings, setOpenComponentSettings] = useState(false);
  const [backgroundSetting, setBackgroundSetting] = useState({ type: "solid", attributes: { color: "#FFFFFF" } });
  const [slideTransition, setSlideTransition] = useState("none");
  const [showDefaultImage, setShowDefaultImage] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (openComponentSettings) {
      const initialBackgroundSetting = getSlideByPosition(presentations, index).background;
      setBackgroundSetting(initialBackgroundSetting);
      setShowDefaultImage(!initialBackgroundSetting.attributes.image);
    }
  }, [openComponentSettings, presentations, index]);
  
  const handleSave = () => {
    // Clone backgroundSetting to modify it safely
    const updatedBackgroundSetting = JSON.parse(JSON.stringify(backgroundSetting));

    const defaultBackgroundAttributesSettings = {
      color: "#FFFFFF",
      startingColor: "#FFFFFF",
      endingColor: "#FFFFFF",
      angle: 0,
      image: ""
    }
    updatedBackgroundSetting.attributes = defaultBackgroundAttributesSettings;
  
    // Reset non-relevant fields for each background type
    switch (updatedBackgroundSetting.type) {
    case "solid":
      updatedBackgroundSetting.attributes.color = backgroundSetting.attributes.color;
      break;
    case "gradient":
      updatedBackgroundSetting.attributes.startingColor = backgroundSetting.attributes.startingColor;
      updatedBackgroundSetting.attributes.endingColor = backgroundSetting.attributes.endingColor;
      updatedBackgroundSetting.attributes.angle = backgroundSetting.attributes.angle;
      break;
    case "image":
      updatedBackgroundSetting.attributes.image = backgroundSetting.attributes.image;
      break;
    }
  
    dispatch(updateSlideBackground({updatedBackgroundSetting, index}));
    dispatch(updateSlideTranistion({slideTransition, index}));
    
    setOpenComponentSettings(false);
  };

  const handleBackgroundChange = (field, nestedField) => (event) => {
    setBackgroundSetting((prev) => ({
      ...prev,
      [field]: nestedField 
        ? { ...prev[field], [nestedField]: event.target.value }
        : event.target.value,
    }));
  };

  const onBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundSetting(prev => ({
          ...prev,
          attributes: { ...prev.attributes, image: e.target.result }
        }));
        setShowDefaultImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current.click();
  };

  const handleDeletePresentation = () => {
    dispatch(deletePresentation(parseInt(getCurrentPresentationId())));
    navigate("/dashboard");
    setDeleteDialogOpen(false);
  };

  // Retrieve the parent container's dimensions on mount
  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = parentRef.current.getBoundingClientRect();
      setParentDimensions({ width, height });
    };

    updateDimensions();

    window.addEventListener("resize", () => updateDimensions());
    return () => window.removeEventListener("resize", () => updateDimensions());
  }, []);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDraggingEvent ? 'grabbing' : 'pointer',
    position: 'relative',
    minWidth: "100px",
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    borderRadius: "10px", 
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    '&:hover': {
      backgroundColor: "#f0f0f0",
      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
    },
    border: index === parseInt(getCurrentSlideNum()) ? "2px solid black" : ""
  };

  useEffect(() => {
    const handleMouseMove = () => setIsDraggingEvent(true);

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      setIsDraggingEvent(false);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      setIsDraggingEvent(false);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    if (Math.pow(mousePosition.x - e.clientX, 2) + Math.pow(mousePosition.y - e.clientY, 2) <= 100) {
      if (e.target.closest('#delete-button')) {
        handleDeleteClick();
      } else if (e.target.closest('#settings-button')) {
        setOpenComponentSettings(true);
      } else {
        navigate(`${location.pathname}#/${index}`);
      }
    } else {
      console.log('Drag event detected');
    }
  };

  const handleDeleteClick = () => {
    if (getSlides(presentations).length > 1) {
      dispatch(deleteSlide(index));
      if (index <= parseInt(getCurrentSlideNum()) && parseInt(getCurrentSlideNum()) !== 1) {
        navigate(`${location.pathname}#/${parseInt(getCurrentSlideNum()) - 1}`);
      }
    } else {
      setDeleteDialogOpen(true);
    }
  };

  return (
    <>
      <Box
        ref={(el) => {
          setNodeRef(el);
          parentRef.current = el;
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...attributes}
        {...listeners}
        sx={{
          ...style,
          'touchAction': 'none',
          'aspectRatio': 16/9,
          '&:hover .icon-buttons': { opacity: 1 }
        }}
      >
        <Box sx={{...renderBackground(presentations, index), width: "100%", height: "100%"}}>
          <Box 
            className="icon-buttons" 
            sx={{ 
              position: "absolute",
              top: 0, 
              right: 0, 
              display: "flex", 
              justifyContent: "space-between", 
              width: "100%", 
              opacity: 0, 
              transition: "opacity 0.3s ease",
              zIndex: 999
            }}
          >
            <IconButton id="settings-button" size="small" sx={{ color: theme.palette.primary.main, zIndex: 1000 }} onClick={(e) => e.stopPropagation()}>
              <Settings />
            </IconButton>
            <IconButton
              id="delete-button" 
              size="small" 
              sx={{ color: "red" }}
            >
              <Delete />
            </IconButton>
          </Box>
          
          {getSlideByPosition(presentations, index)?.contents.map((element) => (
            <Block
              interactable={false} 
              parentHeight={parentDimensions.height} 
              parentWidth={parentDimensions.width} 
              key={element.index} 
              index={element.index} 
              slideNum={index}
            />
          ))}
        </Box>
      </Box>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeletePresentation}
        slideIndex={index}
        isLastSlide={isLastSlide}
      />

      <Dialog
        open={openComponentSettings}
        onClose={() => setOpenComponentSettings(false)}
        onClick={(e) => e.stopPropagation()}
        fullWidth
      >
        <DialogTitle>
          Slide Settings
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <InputLabel>Slide Background</InputLabel>
            <Select
              value={backgroundSetting.type}
              onChange={handleBackgroundChange('type')}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="solid">Solid</MenuItem>
              <MenuItem value="gradient">Gradient</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </Select>

            {backgroundSetting.type === "solid" && (
              <TextField
                fullWidth
                label="Background Colour"
                type="color"
                value={backgroundSetting.attributes.color || "#FFFFFF"}
                onChange={handleBackgroundChange('attributes', 'color')}
              />
            )}
            {backgroundSetting.type === "gradient" && 
              <>
                <TextField
                  fullWidth
                  label="Starting Colour"
                  type="color"
                  value={backgroundSetting.attributes.startingColor || "#FFFFFF"}
                  onChange={handleBackgroundChange('attributes', 'startingColor')}
                />
                <TextField
                  fullWidth
                  label="Ending Colour"
                  type="color"
                  value={backgroundSetting.attributes.endingColor || "#FFFFFF"}
                  onChange={handleBackgroundChange('attributes', 'endingColor')}
                />
                <TextField
                  fullWidth
                  label="Gradient Angle"
                  type="number"
                  value={backgroundSetting.attributes.angle}
                  onChange={handleBackgroundChange('attributes', 'angle')}
                  inputProps={{
                    min: 0,
                    max: 360,
                    step: 1
                  }}
                />
              </>
            }
            {backgroundSetting.type === "image" &&
              <Stack spacing={1}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onBackgroundImageChange}
                  style={{ display: 'none' }}
                />
                <Card sx={{ width: '100%', maxWidth: 345 }}>
                  <CardActionArea onClick={handleCardClick}>
                    {!showDefaultImage ? (
                      <CardMedia
                        component="img"
                        sx={{ height: 194 }}
                        image={backgroundSetting.attributes.image}
                        title="Background Image"
                      />
                    ) : (
                      <CardMedia
                        sx={{
                          height: 194,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'grey.100'
                        }}
                      >
                        <Stack alignItems="center" spacing={1}>
                          <Image color="action" sx={{ fontSize: 40 }} />
                          <Typography variant="body2" color="text.secondary">
                            Click to add background image
                          </Typography>
                        </Stack>
                      </CardMedia>
                    )}
                  </CardActionArea>
                </Card>
              </Stack>
            }
          </Stack>

          <Divider sx={{ marginY: 2, backgroundColor: 'grey.300' }} />

          <Stack spacing={1}>
            <InputLabel>Slide Transition</InputLabel>
            <Select
              value={slideTransition}
              onChange={(e) => setSlideTransition(e.target.value)}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="fade">Fade</MenuItem>
            </Select>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenComponentSettings(false)}
            color="primary"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SlidesBarComponent;
